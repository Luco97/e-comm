import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, UpdateResult } from 'typeorm';
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
    product_id: number;
    name: string;
    url: string;
    stock: number;
    image_src?: string[];
    price?: number;
    description?: string;
    order?: number;
  }): Promise<ExtraEntity> {
    const {
      name,
      description,
      stock,
      image_src,
      url,
      product_id,
      price,
      order,
    } = parameters;

    const new_extra = this._extraRepo.create({
      name,
      image_src,
      url,
      description,
      price,
      stock,
      priority: order,
      product: { id: product_id },
      // porcentaje no debe ser seteado al crear variacion
      percent_discount: 0,
    });
    return this._extraRepo.save(new_extra);
  }

  findOne(parameters: {
    product_id: number;
    extra_id: number;
    url: number;
  }): Promise<ExtraEntity> {
    const { extra_id, product_id, url } = parameters;

    return this._extraRepo
      .createQueryBuilder('extra')
      .leftJoin('extra.product', 'product')
      .where('product.id = :product_id', { product_id })
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('extra.id = :extra_id', { extra_id })
            .orWhere('extra.url = :url', { url }),
        ),
      )
      .getOne();
  }

  update(parameters: {
    id: number;
    name: string;
    url: string;
    stock: number;
    image_src?: string[];
    price?: number;
    description?: string;
    order?: number;
    percent_discount?: number;
  }): Promise<UpdateResult> {
    const {
      id,
      name,
      description,
      stock,
      image_src,
      url,
      price,
      order,
      percent_discount,
    } = parameters;
    const updateItems: QueryDeepPartialEntity<ExtraEntity> = {};

    if (name) updateItems['name'] = name;
    if (description) updateItems['description'] = description;
    if (stock) updateItems['stock'] = stock;
    if (url) updateItems['url'] = url;
    if (price) updateItems['price'] = price;
    if (order) updateItems['priority'] = order;
    if (percent_discount) updateItems['percent_discount'] = percent_discount;
    // IMAGENES YA LLEGAN CON URL DE CLOUDINARY
    if (image_src) updateItems['image_src'] = image_src;

    return this._extraRepo.update(
      {
        id,
      },
      updateItems,
    );
  }
}
