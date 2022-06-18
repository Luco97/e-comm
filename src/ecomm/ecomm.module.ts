import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './controller/auth.controller';
import { OrderController } from './controller/order.controller';
import { ProductController } from './controller/product.controller';
import { CategoryController } from './controller/category.controller';
import { UserService } from './services/user.service';
import { OrderService } from './services/order.service';
import { ProductService } from './services/product.service';
import { AuthModule } from '../shared/auth/auth.module';
import { RolesModule } from '@shared/roles/roles.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, AuthModule, RolesModule],
  controllers: [
    AuthController,
    OrderController,
    ProductController,
    CategoryController,
  ],
  providers: [UserService, OrderService, ProductService],
})
export class EcommModule {}
