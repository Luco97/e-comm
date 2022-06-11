import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductEntityService {
  constructor(
    @InjectRepository(ProductEntity)
    private _productRepo: Repository<ProductEntity>,
  ) {}
}
