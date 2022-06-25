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

  async findOne(id: number) {
    return this._orderRepo
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.products', 'products')
      .where('order.id = :id', { id })
      .getOne();
  }
}
