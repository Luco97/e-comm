import { Injectable, HttpStatus } from '@nestjs/common';

import { UpdateResult } from 'typeorm';
import { from, map, Observable, mergeMap, of, forkJoin } from 'rxjs';

import { response } from '@ecomm/interfaces';
import { Create, Update } from '@ecomm/dtos/product';
import { CategoryEntityService } from '@database/models/category';
import { ProductEntityService, ProductEntity } from '@database/models/product';

@Injectable()
export class ProductService {
  constructor(
    private _productEntityService: ProductEntityService,
    private _categoryEntityService: CategoryEntityService,
  ) {}

  findAll(
    parameters: {
      orderBy: string;
      order: 'ASC' | 'DESC';
      take: number;
      skip: number;
      search?: string;
    },
    category_id: number,
  ) {
    const obs = category_id
      ? from(
          this._productEntityService.findAllCategory(parameters, category_id),
        )
      : from(this._productEntityService.findAll(parameters));

    return obs.pipe(
      map<[ProductEntity[], number], response>(([products, count]) => ({
        status: HttpStatus.OK,
        message: category_id
          ? `all products with category_id = ${category_id}`
          : `all products`,
        response: { products, count },
      })),
    );
  }

  findOne(id: number): Observable<response> {
    return from(this._productEntityService.findOne(id)).pipe(
      map<ProductEntity, response>((product) => ({
        status: HttpStatus.OK,
        message: 'one product',
        response: product,
      })),
    );
  }

  create(createBody: Create): Observable<response> {
    const { description, image_src, name, offer, price, stock, category_id } =
      createBody;
    return from(this._categoryEntityService.findOne(category_id)).pipe(
      mergeMap((category) =>
        category
          ? from(
              this._productEntityService.create({
                name,
                offer,
                price,
                stock,
                image_src,
                description,
                category,
              }),
            )
          : from(
              this._productEntityService.create({
                name,
                offer,
                price,
                stock,
                image_src,
                description,
              }),
            ),
      ),
      map<ProductEntity, response>((response) => ({
        status: HttpStatus.CREATED,
        message: response?.category
          ? `product created with category =  ${response.category.name}`
          : 'product created',
        response,
      })),
    );
  }

  update(updateBody: Update, product_id: number): Observable<response> {
    const { category_id, description, image_src, name, offer, price, stock } =
      updateBody;
    return forkJoin([
      from(this._productEntityService.findOne(product_id)),
      from(this._categoryEntityService.findOne(category_id)),
    ]).pipe(
      mergeMap(([product, category]) =>
        product
          ? from(
              this._productEntityService.update({
                id: product.id,
                name: name || product.name,
                offer: offer || product.offer,
                price: price || product.price,
                stock: stock || product.stock,
                image_src: image_src || product.image_src,
                description: description || product.description,
                category: category || product.category,
              }),
            ).pipe(
              map<ProductEntity, response>((response) => ({
                status: HttpStatus.CREATED,
                message: 'product updated',
                response,
              })),
            )
          : of<response>({
              status: HttpStatus.NOT_FOUND,
              message: `product with id = '${product_id}' doesn't exist`,
            }),
      ),
    );
  }

  delete(id: number): Observable<response> {
    return from(this._productEntityService.findOne(id)).pipe(
      mergeMap((response) =>
        response
          ? from(this._productEntityService.delete(id)).pipe(
              map<UpdateResult, response>(() => ({
                status: HttpStatus.OK,
                message: `product soft deleted (bring ORDER back cleaning 'deleted_at' column of product with id = '${id}')`,
              })),
            )
          : of<response>({
              status: HttpStatus.NOT_FOUND,
              message: `product with id = '${id}' doesn't exist`,
            }),
      ),
    );
  }
}
