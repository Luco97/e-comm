import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ExtraEntity } from './extra.entity';

@Injectable()
export class ExtraEntityService {
  constructor(
    @InjectRepository(ExtraEntity)
    private _extraRepo: Repository<ExtraEntity>,
  ) {
    // this.update({ id: 3, product_id: 2, price_variation: 222 });
  }

  create(parameters: {
    key: string;
    stock: number;
    product_id: number;
    image_src?: string;
    price_variation?: number;
  }): Promise<ExtraEntity> {
    const { key, stock, image_src, price_variation, product_id } = parameters;

    const new_extra = this._extraRepo.create({
      key,
      image_src,
      price_variation,
      stock,
      product: { id: product_id },
    });
    return this._extraRepo.save(new_extra);
  }

  findOne(parameters: {
    product_id: number;
    extra_id: number;
  }): Promise<ExtraEntity> {
    const { extra_id, product_id } = parameters;

    return this._extraRepo
      .createQueryBuilder('extra')
      .leftJoin('extra.product', 'product')
      .where('extra.id = :extra_id', { extra_id })
      .andWhere('product.id = :product_id', { product_id })
      .getOne();
  }

  update(parameters: {
    id: number;
    key?: string;
    stock?: number;
    price_variation?: number;
    image_src?: string;
  }): Promise<UpdateResult> {
    const { id, price_variation, image_src, key, stock } = parameters;
    const updateItems: QueryDeepPartialEntity<ExtraEntity> = {};

    if (key) updateItems['key'] = key;
    if (stock) updateItems['stock'] = stock;
    if (image_src) updateItems['image_src'] = image_src;
    if (price_variation) updateItems['price_variation'] = price_variation;

    return this._extraRepo.update(
      {
        id,
      },
      updateItems,
    );
  }
}
