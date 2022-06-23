import { Injectable, HttpStatus } from '@nestjs/common';
import { from, Observable, forkJoin, map, mergeMap, of } from 'rxjs';

import { Create } from '@ecomm/dtos/order';
import { UtilsService } from '@shared/auth';
import { response } from '../interfaces/response';
import { OrderEntityService } from '@database/models/order';
import { ProductEntity, ProductEntityService } from '@database/models/product';

@Injectable()
export class OrderService {
  constructor(
    private _utilsService: UtilsService,
    private _orderEntityService: OrderEntityService,
    private _productEntityService: ProductEntityService,
  ) {}

  async getAllOrders(
    parameters: {
      orderBy: string;
      order: 'ASC' | 'DESC';
      take: any;
      skip: any;
    },
    token: string,
  ): Promise<response> {
    const user_uuid = this._utilsService.userUuid(token);
    const [orders, count] = await this._orderEntityService.findAll(
      parameters,
      user_uuid,
    );
    return {
      status: HttpStatus.OK,
      message: `orders of => ${user_uuid}`,
      response: {
        orders,
        count,
      },
    };
  }

  processProducts(createOrder: Create) {
    const findArray: Observable<ProductEntity>[] = [];
    createOrder.products.forEach((product) => {
      findArray.push(
        from(
          this._productEntityService.findOne(
            product.product_id,
            product.quantity,
          ),
        ),
      );
    });
    return forkJoin(findArray).pipe(
      map((data) => {
        const index = data.findIndex((product) => !product);
        return index >= 0
          ? {
              products: data,
              message: 'conditions accepted',
              details: createOrder.products,
            }
          : {
              products: [],
              message: `product with id = '${createOrder.products[index]}' quantity is greater than the stock`,
              details: createOrder.products,
            };
      }),
      mergeMap(({ products, message, details }) => {
        if (products.length) {
          products.forEach((product, index) => {
            product.stock -= createOrder.products[index].quantity;
          });
          return from(this._productEntityService.updateAll(products)).pipe(
            map((products) => {
              return { products, message, details };
            }),
          );
        } else return of({ products, message, details });
      }),
    );
  }

  createOrder(createOrder: Create) {}
}
