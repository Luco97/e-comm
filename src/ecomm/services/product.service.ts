import { Injectable, HttpStatus } from '@nestjs/common';

import { DeepPartial, UpdateResult } from 'typeorm';
import { from, map, Observable, mergeMap, of, forkJoin } from 'rxjs';

import { response } from '@ecomm/interfaces';
import { CreateExtra, UpdateExtra } from '@ecomm/dtos/extras';
import { Create, Update } from '@ecomm/dtos/product';
import { CategoryEntityService } from '@database/models/category';
import { ExtraEntity, ExtraEntityService } from '@database/models/extra';
import { ProductEntityService, ProductEntity } from '@database/models/product';

@Injectable()
export class ProductService {
  constructor(
    private _extraEntityService: ExtraEntityService,
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
    const { description, image_src, name, offer, category_id } = createBody;
    return from(this._categoryEntityService.findAllById(category_id)).pipe(
      mergeMap((categories) => {
        const newProduct: DeepPartial<ProductEntity> = {
          name,
          upper_offer: offer,
          general_description: description,
        };
        if (categories?.length) newProduct['categories'] = categories;
        return from(this._productEntityService.create(newProduct));
      }),
      map<ProductEntity, response>((response) => ({
        status: HttpStatus.CREATED,
        message: response?.categories?.length
          ? `product created with categories =  ${response.categories
              .map<string>((element) => `<${element.name}>`)
              .join('/')}`
          : 'product created with no categories',
        response,
      })),
    );
  }

  update(updateBody: Update, product_id: number): Observable<response> {
    const { category_id, description, image_src, name, offer, price, stock } =
      updateBody;

    const dumpCategories: boolean = 'category_id' in updateBody;

    return forkJoin([
      from(this._productEntityService.findOne(product_id)),
      from(this._categoryEntityService.findAllById(category_id)),
    ]).pipe(
      mergeMap(([product, categories]) =>
        product
          ? from(
              this._productEntityService.update({
                id: product.id,
                name: name || product.name,
                upper_offer: offer || product.upper_offer,
                general_description: description || product.general_description,
                // De esta forma es posible tambien quitar (siempre y cuando se sumen)
                categories: dumpCategories ? categories : product.categories,
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

  addExtras(
    createExtrasBody: CreateExtra,
    product_id: number,
  ): Observable<response> {
    const { name, price_variation, stock, url, description, image_src, order } =
      createExtrasBody;
    // return from(this._productEntityService.findOne(product_id)).pipe(
    //   mergeMap((product) => {
    //     if (!product)
    //       return of<response>({
    //         status: HttpStatus.NOT_FOUND,
    //         message: `product with id = '${product_id}' doesn't exist`,
    //       });
    //     else
    //       return from(
    //         this._extraEntityService.create({
    //           key,
    //           stock,
    //           image_src,
    //           product_id,
    //           price_variation,
    //         }),
    //       ).pipe(
    //         map<ExtraEntity, response>((variation) => ({
    //           status: HttpStatus.CREATED,
    //           message: `variation created`,
    //           response: variation,
    //         })),
    //       );
    //   }),
    // );
    return of({ status: 200 });
  }

  updateExtras(
    product_id: number,
    extra_id: number,
    updateBody: UpdateExtra,
  ): Observable<response> {
    const { image_src, key, price_variation, stock } = updateBody;

    // return from(
    //   this._extraEntityService.findOne({ extra_id, product_id }),
    // ).pipe(
    //   mergeMap((extra) => {
    //     if (!extra)
    //       return of<response>({
    //         status: HttpStatus.OK,
    //         message: `No extra found`,
    //       });
    //     else
    //       return from(
    //         this._extraEntityService.update({
    //           id: extra_id,
    //           image_src,
    //           key,
    //           price_variation,
    //           stock,
    //         }),
    //       ).pipe(
    //         map<UpdateResult, response>((a) => ({
    //           status: HttpStatus.OK,
    //           message: `No extra found`,
    //         })),
    //       );
    //   }),
    // );
    return of({ status: 200 });
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
