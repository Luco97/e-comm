import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductEntityService {
  constructor(
    @InjectRepository(ProductEntity)
    private _productRepo: Repository<ProductEntity>,
  ) {}

  create(newProduct: DeepPartial<ProductEntity>) {
    const product = this._productRepo.create(newProduct);
    return this._productRepo.save(product);
  }

  findAll(parameters: {
    orderBy: string;
    order: 'ASC' | 'DESC';
    take: number;
    skip: number;
  }) {
    const { orderBy, order, skip, take } = parameters;
    return this._productRepo
      .createQueryBuilder('products')
      .innerJoinAndSelect('products.category', 'category')
      .orderBy(`products.${orderBy}`, order)
      .take(take || 5)
      .skip(skip || 0)
      .getManyAndCount();
  }

  findAllCategory(
    parameters: {
      orderBy: string;
      order: 'ASC' | 'DESC';
      take: number;
      skip: number;
    },
    category_id: number,
  ) {
    const { orderBy, order, skip, take } = parameters;
    return this._productRepo
      .createQueryBuilder('products')
      .innerJoin('products.category', 'category')
      .where('category = :category_id', { category_id })
      .orderBy(`products.${orderBy}`, order)
      .take(take || 5)
      .skip(skip || 0)
      .getManyAndCount();
  }

  delete(id: number) {
    return this._productRepo.softDelete(id);
  }
}
