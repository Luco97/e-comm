import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entities services
import { UserEntityService } from './models/user/user.entity.service';
import { RoleEntityService } from './models/role/role.entity.service';
import { OrderEntityService } from './models/order/order.entity.service';
import { ExtraEntityService } from './models/extra/extra.entity.service';
import { ProductEntityService } from './models/product/product.entity.service';
import { CategoryEntityService } from './models/category/category.entity.service';
import { BrandingEntityService } from './models/branding/branding.entity.service';

// Entities
import { RoleEntity } from './models/role/role.entity';
import { UserEntity } from './models/user/user.entity';
import { OrderEntity } from './models/order/order.entity';
import { ExtraEntity } from './models/extra/extra.entity';
import { ProductEntity } from './models/product/product.entity';
import { CategoryEntity } from './models/category/category.entity';
import { BrandingEntity } from './models/branding/branding.entity';

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
          ExtraEntity,
          ProductEntity,
          CategoryEntity,
          BrandingEntity,
        ],
        url: configService.get('DATABASE_URL'),
        synchronize:
          configService.get('NODE_ENV') != 'production' ? true : false,
          // true,
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
      ExtraEntity,
      ProductEntity,
      CategoryEntity,
      BrandingEntity,
    ]),
  ],
  exports: [
    UserEntityService,
    RoleEntityService,
    OrderEntityService,
    ExtraEntityService,
    ProductEntityService,
    CategoryEntityService,
    BrandingEntityService,
  ],
  providers: [
    UserEntityService,
    RoleEntityService,
    OrderEntityService,
    ExtraEntityService,
    ProductEntityService,
    CategoryEntityService,
    BrandingEntityService,
  ],
})
export class DatabaseModule {}
