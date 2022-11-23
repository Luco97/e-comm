import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DeepPartial, Repository, UpdateResult } from 'typeorm';

import { ProductEntity } from './product.entity';

@Injectable()
export class ProductEntityService {
  constructor(
    @InjectRepository(ProductEntity)
    private _productRepo: Repository<ProductEntity>,
  ) {}

  create(newProduct: DeepPartial<ProductEntity>): Promise<ProductEntity> {
    const product = this._productRepo.create(newProduct);
    return this._productRepo.save(product);
  }

  findAll(parameters: {
    orderBy: string;
    order: 'ASC' | 'DESC';
    take: number;
    skip: number;
    search?: string;
  }): Promise<[ProductEntity[], number]> {
    const { orderBy, order, skip, take, search } = parameters;
    return this._productRepo
      .createQueryBuilder('products')
      .innerJoinAndSelect('products.category', 'category')
      .where(
        new Brackets((qp) => {
          search
            ? qp.where('LOWER(products.name) like :search', {
                search: `%${search}%`,
              })
            : 0;
        }),
      )
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
      search?: string;
    },
    category_id: number,
  ): Promise<[ProductEntity[], number]> {
    const { orderBy, order, skip, take, search } = parameters;
    return this._productRepo
      .createQueryBuilder('products')
      .innerJoin('products.category', 'category')
      .where('category.id = :category_id', { category_id })
      .andWhere(
        new Brackets((qp) => {
          search
            ? qp.where('LOWER(products.name) like :search', { search })
            : 0;
        }),
      )
      .orderBy(`products.${orderBy}`, order)
      .take(take || 5)
      .skip(skip || 0)
      .getManyAndCount();
  }

  findAllByIds(productIds: number[]): Promise<ProductEntity[]> {
    return this._productRepo
      .createQueryBuilder('product')
      .where('product.id IN (...:productIds)', { productIds })
      .getMany();
  }

  findOne(id: number): Promise<ProductEntity> {
    return this._productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.id = :id', { id })
      .getOne();
  }

  delete(id: number): Promise<UpdateResult> {
    return this._productRepo.softDelete(id);
  }

  update(product: DeepPartial<ProductEntity>): Promise<ProductEntity> {
    return this._productRepo.save(product);
  }

  updateAll(products: ProductEntity[]): Promise<ProductEntity[]> {
    return this._productRepo.save(products);
  }
}
