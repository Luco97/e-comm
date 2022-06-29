import { UpdateResult } from 'typeorm';
import { Injectable, HttpStatus } from '@nestjs/common';
import { from, Observable, forkJoin, map, mergeMap, of } from 'rxjs';

import { Create } from '@ecomm/dtos/order';
import { UtilsService } from '@shared/auth';
import { ProductJSON, response } from '@ecomm/interfaces';
import { RoleEntityService } from '@database/models/role';
import { OrderEntity, OrderEntityService } from '@database/models/order';
import { ProductEntity, ProductEntityService } from '@database/models/product';

@Injectable()
export class OrderService {
  constructor(
    private _utilsService: UtilsService,
    private _roleEntityService: RoleEntityService,
    private _orderEntityService: OrderEntityService,
    private _productEntityService: ProductEntityService,
  ) {}

  getAllOrders(
    parameters: {
      orderBy: string;
      order: 'ASC' | 'DESC';
      take: any;
      skip: any;
    },
    token: string,
  ): Observable<response> {
    const user_uuid = this._utilsService.userUuid(token);
    return from(this._orderEntityService.findAll(parameters, user_uuid)).pipe(
      map<[OrderEntity[], number], response>(([orders, count]) => ({
        status: HttpStatus.OK,
        message: `orders of => ${user_uuid}`,
        response: {
          orders,
          count,
        },
      })),
    );
  }

  getOneOrder(parameters: { token: string; id: number }) {
    const { id, token } = parameters;
    const uuid = this._utilsService.userUuid(token);
    return from(this._roleEntityService.findByRole('admin', uuid)).pipe(
      mergeMap((role) =>
        role
          ? from(this._orderEntityService.findOne(id))
          : from(this._orderEntityService.findOne(id, uuid)),
      ),
      map<OrderEntity, response>((resp) => ({
        status: HttpStatus.OK,
        message: 'findOne ORDER',
        response: resp,
      })),
    );
  }

  processProducts(createOrder: Create) {
    const findArray: Observable<ProductEntity>[] = [];
    createOrder.products.forEach((product) => {
      findArray.push(
        from(
          this._productEntityService.findOne(
            product.product_id,
            // ,product.quantity,
          ),
        ),
      );
    });
    return forkJoin(findArray).pipe(
      map((data) => {
        const productsCart: ProductJSON = createOrder.products.reduce(
          (acc, curr) => ({ ...acc, [curr.product_id]: curr.quantity }),
          {},
        );
        const ifExist = data.findIndex((product) => !product);
        const ifStock =
          ifExist < 0
            ? data.findIndex(
                (product) =>
                  product?.stock - productsCart[`${product?.id}`] < 0,
              )
            : -1;
        const products_id = createOrder.products.reduce(
          (acc: number[], curr) => [curr.product_id, ...acc],
          [],
        );
        return ifExist < 0 && ifStock < 0
          ? {
              products: data,
              message: 'conditions accepted',
              details: productsCart,
              extra: products_id,
            }
          : {
              products: [],
              message:
                ifExist < 0
                  ? `quantity of product with id = '${createOrder.products[ifStock].product_id}' is greater than the stock avalible`
                  : `product with id = '${createOrder.products[ifExist].product_id}' doesn't exist`,
              details: productsCart,
              extra: products_id,
            };
      }),
      mergeMap(({ products, message, details, extra }) => {
        if (products.length) {
          products.forEach((product, index) => {
            createOrder.products[index].quantity =
              product.stock - createOrder.products[index].quantity;
            // product.stock -= createOrder.products[index].quantity;
          });
          return from(this._productEntityService.updateAll(products)).pipe(
            map((products) => {
              return { products, message, details, extra };
            }),
          );
        } else return of({ products, message, details, extra });
      }),
    );
  }

  createOrder(
    token: string,
    createOrder: Create,
    process: {
      products: ProductEntity[];
      message: string;
      details: ProductJSON;
      extra?: number[];
    },
  ): Observable<response> {
    const { address, city, council, latitude, longitude } = createOrder;
    const { details, message, products, extra } = process;
    if (!products.length)
      return of({
        status: HttpStatus.NOT_ACCEPTABLE,
        message,
        response: { details },
      });
    else {
      const uuid: string = this._utilsService.userUuid(token);
      return from(
        this._orderEntityService.create({
          cost: 0,
          status: 1,
          details,
          address,
          city,
          council,
          latitude,
          longitude,
        }),
      ).pipe(
        mergeMap((order) => {
          products.forEach((product) => {
            order.cost += product.price - product.price * product.offer;
          });
          return from(this._orderEntityService.update(order));
        }),
        mergeMap((order) =>
          forkJoin([
            from(this._orderEntityService.createUserOrder(order.id, uuid)),
            from(this._orderEntityService.createProductOrder(order.id, extra)),
          ]).pipe(
            map(([orderInnerUser, orderInnerProduct]) => ({
              status: HttpStatus.OK,
              message: 'Order created successfully',
              response: {
                ...order,
                products,
              },
            })),
          ),
        ),
      );
    }
  }

  deleteOrder(id: number): Observable<response> {
    return from(this._orderEntityService.findOne(id)).pipe(
      mergeMap((data) =>
        data
          ? from(this._orderEntityService.delete(id)).pipe(
              map<UpdateResult, response>((resp) => ({
                status: HttpStatus.OK,
                message: `order soft deleted (bring ORDER back cleaning 'deleted_at' column of order with id = '${data.id}')`,
                // response: data
              })),
            )
          : of<response>({
              status: HttpStatus.NOT_FOUND,
              message: `order with id = '${id}' doesn't exist`,
            }),
      ),
    );
  }
}
