import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderEntityService {
  constructor(
    @InjectRepository(OrderEntity)
    private _orderRepo: Repository<OrderEntity>,
  ) {}

  async create(newOrder: DeepPartial<OrderEntity>) {
    const order = this._orderRepo.create(newOrder);
    return this._orderRepo.save(order);
  }

  async update(order: OrderEntity) {
    return this._orderRepo.save(order);
  }

  async createUserOrder(orderID: number, uuid: string) {
    return this._orderRepo
      .createQueryBuilder('order')
      .relation('user')
      .of(orderID)
      .set(uuid);
  }

  async createProductOrder(orderID: number, products_id: number[]) {
    return this._orderRepo
      .createQueryBuilder('order')
      .relation('products')
      .of(orderID)
      .add(products_id);
  }

  async findAll(
    parameters: {
      orderBy: string;
      order: 'ASC' | 'DESC';
      take: number;
      skip: number;
    },
    uuid?: string,
  ) {
    const { order, orderBy, skip, take } = parameters;
    const QB = this._orderRepo.createQueryBuilder('orders');
    if (uuid)
      QB.innerJoin('orders.user', 'user', 'user.uuid = :uuid', { uuid }).where(
        'user.uuid = :uuid',
        { uuid },
      );
    return QB.orderBy(`orders.${orderBy || 'created_at'}`, order)
      .take(take || 10)
      .skip(skip || 0)
      .getManyAndCount();
  }

  async findOne(id: number, user_uuid?: string) {
    const QB = this._orderRepo.createQueryBuilder('order');
    QB.innerJoinAndSelect('order.products', 'products');
    if (user_uuid)
      QB.innerJoin('order.user', 'user').where(
        'order.id = :id AND user.id = :user_uuid',
        { id, user_uuid },
      );
    else QB.where('order.id = :id', { id });

    return QB.getOne();
  }

  async delete(id: number) {
    return this._orderRepo.softDelete(id);
  }
}
