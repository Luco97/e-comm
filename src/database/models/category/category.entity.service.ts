import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { ProductEntity } from '../product/product.entity';

@Injectable()
export class CategoryEntityService {
  constructor(
    @InjectRepository(CategoryEntity)
    private _categoryRepo: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<CategoryEntity[]> {
    return this._categoryRepo
      .createQueryBuilder('category')
      .select(['category.id AS id', 'category.name AS name'])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(products.id)', 'products.id')
          .from(ProductEntity, 'products')
          .where('products.category.id = category.id');
      }, 'count')
      .orderBy('count', 'DESC')
      .getRawMany();
  }

  async findOne(id: number) {
    return this._categoryRepo
      .createQueryBuilder('category')
      .select(['category.id AS id', 'category.name AS name'])
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COUNT(products.id)', 'products.id')
            .from(ProductEntity, 'products')
            .where('products.category.id = category.id'),
        'count',
      )
      .where('category.id = :id', { id })
      .getRawOne();
  }

  async create(newCategory: DeepPartial<CategoryEntity>) {
    const category = this._categoryRepo.create(newCategory);
    return this._categoryRepo.save(category);
  }

  async delete(id: number) {
    return this._categoryRepo.delete(id);
  }
}
