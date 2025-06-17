import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity';
import { BrandingEntity } from './branding.entity';

@Injectable()
export class BrandingEntityService {
  constructor(
    @InjectRepository(BrandingEntity)
    private _brandingRepo: Repository<BrandingEntity>,
  ) {}

  findAll(take: number = 10, skip: number = 0): Promise<BrandingEntity[]> {
    return this._brandingRepo
      .createQueryBuilder('branding')
      .select(['branding.id AS id', 'branding.name AS name'])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(products.id)', 'products.id')
          .from(ProductEntity, 'products')
          .where('products.branding.id = branding.id');
      }, 'count')
      .orderBy('count', 'DESC')
      .take(take)
      .skip(skip)
      .getRawMany();
  }

  findOne(id: number, url?: string): Promise<BrandingEntity> {
    return this._brandingRepo
      .createQueryBuilder('branding')
      .select([
        'branding.id AS id',
        'branding.name AS name',
        'branding.url AS url',
      ])
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COUNT(products.id)', 'products.id')
            .from(ProductEntity, 'products')
            .where('products.branding.id = branding.id'),
        'count',
      )
      .where('branding.id = :id', { id })
      .orWhere('branding.url = :url', { url })
      .getRawOne();
  }

  create(newCategory: DeepPartial<BrandingEntity>): Promise<BrandingEntity> {
    const category = this._brandingRepo.create(newCategory);
    return this._brandingRepo.save(category);
  }

  delete(id: number) {
    return this._brandingRepo.delete(id);
  }
}
