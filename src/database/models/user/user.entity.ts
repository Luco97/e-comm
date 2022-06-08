import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  uuid: string;

  @Column({
    name: 'image_src',
    type: 'varchar',
  })
  image_src: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
  })
  last_name: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  created_at: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    select: false,
  })
  deleted_at: Date;
}
