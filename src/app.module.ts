import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { EcommModule } from './ecomm/ecomm.module';

@Module({
  imports: [EcommModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
