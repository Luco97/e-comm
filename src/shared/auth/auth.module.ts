import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UtilsService } from './services/utils.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),
      }),
    }),
  ],
  exports: [UtilsService],
  providers: [UtilsService],
})
export class AuthModule {}
