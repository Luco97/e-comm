import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoryEntityService {
  constructor(
    @InjectRepository(CategoryEntity)
    private _categoryRepo: Repository<CategoryEntity>,
  ) {}
}
