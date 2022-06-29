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
import { tap } from 'rxjs';
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
    @Query('search') search: string,
    @Res() resp: Response<response>,
  ) {
    const parameters: {
      orderBy: string;
      order: 'ASC' | 'DESC';
      take: any;
      skip: any;
      search: string;
    } = {
      orderBy: ['stock', 'price', 'name', 'created_at'].includes(orderBy)
        ? orderBy
        : 'created_at',
      order: ['ASC', 'DESC'].includes(order)
        ? (order as 'ASC' | 'DESC')
        : 'ASC',
      take: take,
      skip: skip,
      search: `%${search}%` || '',
    };
    this._productService
      .findAll(parameters, category_id)
      .pipe(tap((data) => resp.status(data.status).json(data)))
      .subscribe();
  }

  @Get(':id')
  oneProduct(
    @Param('id', ParseIntPipe) id: number,
    @Res() resp: Response<response>,
  ) {
    this._productService
      .findOne(id)
      .pipe(tap((data) => resp.status(data.status).json(data)))
      .subscribe();
  }

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
