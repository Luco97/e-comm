import { from, map, Observable } from 'rxjs';
import { Injectable, HttpStatus } from '@nestjs/common';

import { response } from '@ecomm/interfaces';
import { ProductEntity, ProductEntityService } from '@database/models/product';

@Injectable()
export class ProductService {
  constructor(private _productEntityService: ProductEntityService) {}

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
}
