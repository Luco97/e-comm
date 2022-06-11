import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderEntityService {
  constructor(
    @InjectRepository(OrderEntity)
    private _orderRepo: Repository<OrderEntity>,
  ) {}
}
