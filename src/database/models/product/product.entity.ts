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
    type: 'real',
    default: 0,
  })
  // Si offer de variante es 0, upper_offer tiene efecto
  upper_offer: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  general_description: string;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'metadata',
    nullable: true,
    type: 'jsonb',
    default: {},
  })
  metadata: any;

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
