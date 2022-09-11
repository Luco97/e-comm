import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entities services
import { UserEntityService } from './models/user/user.entity.service';
import { RoleEntityService } from './models/role/role.entity.service';
import { OrderEntityService } from './models/order/order.entity.service';
import { ProductEntityService } from './models/product/product.entity.service';
import { CategoryEntityService } from './models/category/category.entity.service';

// Entities
import { RoleEntity } from './models/role/role.entity';
import { UserEntity } from './models/user/user.entity';
import { OrderEntity } from './models/order/order.entity';
import { ProductEntity } from './models/product/product.entity';
import { CategoryEntity } from './models/category/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        schema: 'ecomm',
        entities: [
          RoleEntity,
          UserEntity,
          OrderEntity,
          ProductEntity,
          CategoryEntity,
        ],
        url: configService.get('DATABASE_URL'),
        synchronize:
          configService.get('NODE_ENV') != 'production' ? true : false,
        autoLoadEntities: true,
        logging: 'all',
        extra:
          configService.get('NODE_ENV') == 'production'
            ? {
                ssl: {
                  sslmode: true,
                  rejectUnauthorized: false,
                },
              }
            : {},
      }),
    }),
    TypeOrmModule.forFeature([
      RoleEntity,
      UserEntity,
      OrderEntity,
      ProductEntity,
      CategoryEntity,
    ]),
  ],
  exports: [
    UserEntityService,
    RoleEntityService,
    OrderEntityService,
    ProductEntityService,
    CategoryEntityService,
  ],
  providers: [
    UserEntityService,
    RoleEntityService,
    OrderEntityService,
    ProductEntityService,
    CategoryEntityService,
  ],
})
export class DatabaseModule {}
