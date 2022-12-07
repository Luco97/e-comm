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

  getAllOrdersAdmin(
    parameters: {
      orderBy: string;
      order: 'ASC' | 'DESC';
      take: any;
      skip: any;
    },
    username: string,
  ) {
    return from(
      this._orderEntityService.findAllforAdmin(parameters, username),
    ).pipe(
      map<[OrderEntity[], number], response>(([orders, count]) => ({
        status: HttpStatus.OK,
        message: `orders of => ${username ? username : 'All'}`,
        response: {
          orders,
          count,
        },
      })),
    );
  }

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
    const productIds: number[] = createOrder.products.map<number>(
      (element) => element.product_id,
    );

    return from(this._productEntityService.findAllByIds(productIds)).pipe(
      map((data) => {
        const productsCart: ProductJSON = data.reduce<ProductJSON>(
          (acc, { ...curr }) => {
            if (!curr.extras.length)
              return {
                ...acc,
                [curr.id]: {
                  value: curr.price,
                  discount: curr.offer,
                  quantity: createOrder.products.find(
                    (cart_product) => curr.id == cart_product.product_id,
                  ).quantity,
                },
              };
            else
              return {
                ...acc,
                [curr.id]: {
                  value: curr.price,
                  discount: curr.offer,
                  quantity: createOrder.products.find(
                    (cart_product) => (curr.id = cart_product.product_id),
                  ).quantity,
                  variation:
                    curr.extras.find(
                      (extra) =>
                        extra.id ==
                        createOrder.products.find(
                          (cart_product) => (curr.id = cart_product.product_id),
                        ).extra_id,
                    ).key || 'none',
                },
              };
          },
          {},
        );

        const ifExist = productIds.findIndex(
          (element) => !data.find((product) => product.id == element),
        );
        const ifStock =
          data.find((product) => {
            if (!product.extras.length)
              return (
                product.stock - productsCart[`${product?.id}`].quantity < 0
              );
            else
              return (
                (product.extras.find(
                  (variation) =>
                    variation.key == productsCart[`${product?.id}`].variation,
                )?.stock || 0) - productsCart[`${product?.id}`].quantity
              );
          })?.id || -1;
        return ifStock < 0
          ? {
              products: data,
              message: 'conditions accepted',
              details: productsCart,
              extra: productIds,
            }
          : {
              products: [],
              message: `quantity of product with id = '${ifStock}' is greater than the stock avalible`,
              details: productsCart,
              extra: productIds,
            };
      }),
      mergeMap(({ products, message, details, extra }) => {
        if (products.length) {
          products.forEach((product, index) => {
            product.stock =
              product.stock - createOrder.products[index].quantity;
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
