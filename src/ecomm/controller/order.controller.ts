import {
  Get,
  Res,
  Body,
  Post,
  Param,
  Query,
  Delete,
  UseGuards,
  Controller,
  SetMetadata,
  ParseIntPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { tap, mergeMap } from 'rxjs';

import { Create } from '@ecomm/dtos/order';
import { response } from '@ecomm/interfaces';
import { RoleGuard } from '../../guards/role.guard';
import { Token } from '../decorators/token.decorator';
import { OrderService } from '../services/order.service';
import { ParseDefaultIntPipe } from '../pipes/parse-int.pipe';

@Controller('order')
export class OrderController {
  constructor(private _ordersService: OrderService) {}

  @Get()
  @SetMetadata('roles', ['admin', 'basic'])
  @UseGuards(RoleGuard)
  allOrdersFromUser(
    @Token() token: string,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('take', new ParseDefaultIntPipe(10)) take: number,
    @Query('skip', new ParseDefaultIntPipe(0)) skip: number,
    @Res() resp: Response<response>,
  ) {
    const parameters: {
      orderBy: string;
      order: 'ASC' | 'DESC';
      take: any;
      skip: any;
    } = {
      orderBy: ['stock', 'price', 'name', 'created_at'].includes(orderBy)
        ? orderBy
        : 'created_at',
      order: ['ASC', 'DESC'].includes(order)
        ? (order as 'ASC' | 'DESC')
        : 'ASC',
      take: take,
      skip: skip,
    };
    this._ordersService
      .getAllOrders(parameters, token)
      .pipe(tap((data) => resp.status(data.status).json(data)))
      .subscribe();
  }

  @Get('admin')
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  allOrdersAdmin(
    @Query('username') username: string,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('take', new ParseDefaultIntPipe(10)) take: number,
    @Query('skip', new ParseDefaultIntPipe(0)) skip: number,
    @Res() resp: Response<response>,
  ) {
    const parameters: {
      orderBy: string;
      order: 'ASC' | 'DESC';
      take: any;
      skip: any;
    } = {
      orderBy: ['stock', 'price', 'name', 'created_at'].includes(orderBy)
        ? orderBy
        : 'created_at',
      order: ['ASC', 'DESC'].includes(order)
        ? (order as 'ASC' | 'DESC')
        : 'ASC',
      take: take,
      skip: skip,
    };
    this._ordersService
      .getAllOrdersAdmin(parameters, username)
      .pipe(tap((data) => resp.status(data.status).json(data)))
      .subscribe();
  }

  @Get(':id')
  @SetMetadata('roles', ['admin', 'basic'])
  @UseGuards(RoleGuard)
  getOneOrder(
    @Token() token: string,
    @Param('id', ParseIntPipe) id: number,
    @Res() resp: Response<response>,
  ) {
    this._ordersService
      .getOneOrder({ token, id })
      .pipe(tap((response) => resp.status(response.status).json(response)))
      .subscribe();
  }

  @Post()
  @SetMetadata('roles', ['admin', 'basic'])
  @UseGuards(RoleGuard)
  createOrder(
    @Token() token: string,
    @Body() createBody: Create,
    @Res() resp: Response<response>,
  ) {
    // this._ordersService
    //   .processProducts(createBody)
    //   .pipe(
    //     tap((data) =>
    //       resp
    //         .status(200)
    //         .json({ status: 200, message: 'testing', response: data }),
    //     ),
    //   )
    //   .subscribe((data) => console.log(data));
    this._ordersService
      .processProducts(createBody)
      .pipe(
        mergeMap((process) =>
          this._ordersService.createOrder(token, createBody, process),
        ),
        tap((data) => {
          resp.status(data.status).json(data);
        }),
      )
      .subscribe();
  }

  @Delete(':id')
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  deleteOrder(
    @Param('id', ParseIntPipe) id: number,
    @Res() resp: Response<response>,
  ) {
    this._ordersService
      .deleteOrder(id)
      .pipe(tap((data) => resp.status(data.status).json(data)))
      .subscribe();
  }
}
