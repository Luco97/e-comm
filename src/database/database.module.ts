import { Module } from '@nestjs/common';
import { CategoryEntityService } from './models/category/category.entity.service';
import { ProductEntityService } from './models/product/product.entity.service';
import { OrderEntityService } from './models/order/order.entity.service';
import { UserEntityService } from './models/user/user.entity.service';

@Module({
  providers: [
    CategoryEntityService,
    ProductEntityService,
    OrderEntityService,
    UserEntityService,
  ],
})
export class DatabaseModule {}
