import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'variation' })
export class ExtraEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: '20' })
  key: string;

  @Column({
    type: 'varchar',
    length: '20',
    default: 'define value',
  })
  value: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  image_src: string;

  @Column({ type: 'real', default: 1 })
  price_variation: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @ManyToOne(() => ProductEntity, (product) => product.extras)
  product: ProductEntity;
}
