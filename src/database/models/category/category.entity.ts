import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../product/product.entity';

@Entity({
  name: 'category',
})
export class CategoryEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'name',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'icon',
    nullable: true,
  })
  icon: string;

  // @OneToMany(() => ProductEntity, (products) => products.category)
  products?: ProductEntity[];
}
