import { OrderEntity } from '../order/order.entity';
import { CategoryEntity } from '../category/category.entity';
import { ExtraEntity } from '../extra/extra.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BrandingEntity } from '../branding';

@Entity({
  name: 'product',
})
export class ProductEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'image_src',
    type: 'varchar',
    nullable: true,
  })
  image_src: string;

  @Column({
    name: 'offer',
    type: 'real',
    default: 0,
  })
  offer: number;

  @Column({
    name: 'stock',
    type: 'int',
    default: 0,
  })
  stock: number;

  @Column({
    name: 'price',
    type: 'real',
    default: 0,
  })
  price: number;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: CategoryEntity;

  @ManyToOne(() => BrandingEntity, (branding) => branding.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  branding: BrandingEntity;

  @OneToMany(() => ExtraEntity, (extras) => extras.product, {
    nullable: true,
    cascade: true,
  })
  extras: ExtraEntity[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    select: false,
  })
  deleted_at: Date;
}
