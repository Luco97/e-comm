import {
  Get,
  Put,
  Res,
  Body,
  Post,
  Query,
  Param,
  Delete,
  UseGuards,
  Controller,
  SetMetadata,
  ParseIntPipe,
} from '@nestjs/common';
import { Response } from 'express';

import { RoleGuard } from '../../guards/role.guard';
import { Create, Update } from '@ecomm/dtos/product';
import { response } from '../interfaces/response.interface';
import { ProductService } from '../services/product.service';
import { ParseDefaultIntPipe } from '../pipes/parse-int.pipe';

@Controller('product')
export class ProductController {
  constructor(private _productService: ProductService) {}

  @Get()
  allProducts(
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('take', new ParseDefaultIntPipe(10)) take: number,
    @Query('skip', new ParseDefaultIntPipe(0)) skip: number,
    @Query('category', new ParseDefaultIntPipe(0)) category_id: number,
    @Res() resp: Response<response>,
  ) {}

  @Get(':id')
  oneProduct(
    @Param('id', ParseIntPipe) id: number,
    @Res() resp: Response<response>,
  ) {}

  @Post()
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  createProduct(@Body() createBody: Create, @Res() resp: Response<response>) {}

  @Put(':id')
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBody: Update,
    @Res() resp: Response<response>,
  ) {}

  @Delete(':id')
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @Res() resp: Response<response>,
  ) {}
}
