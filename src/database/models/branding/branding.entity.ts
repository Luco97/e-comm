import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../product/product.entity';

@Entity({
  name: 'branding',
})
export class BrandingEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'name',
  })
  name: string;

  @Column({
    name: 'url',
  })
  url: string;

  @Column({
    name: 'metadata',
    nullable: false,
    type: 'jsonb',
  })
  extras: any;

  @OneToMany(() => ProductEntity, (products) => products.branding)
  products: ProductEntity[];
}
