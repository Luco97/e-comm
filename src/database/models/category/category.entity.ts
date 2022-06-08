import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'category',
})
export class CategoryEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

  @Column({
    name: 'name',
    nullable: false,
  })
  name: string;
}
