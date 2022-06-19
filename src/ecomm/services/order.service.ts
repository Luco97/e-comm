import { OrderEntityService } from '@database/models/order';
import { Injectable, HttpStatus } from '@nestjs/common';
import { UtilsService } from '@shared/auth';
import { response } from '../interfaces/response';

@Injectable()
export class OrderService {
  constructor(
    private _utilsService: UtilsService,
    private _orderEntityService: OrderEntityService,
  ) {}

  async getAllOrders(
    parameters: {
      orderBy: string;
      order: 'ASC' | 'DESC';
      take: any;
      skip: any;
    },
    token: string,
  ): Promise<response> {
    const user_uuid = this._utilsService.userUuid(token);
    const [orders, count] = await this._orderEntityService.findAll(
      parameters,
      user_uuid,
    );
    return {
      status: HttpStatus.OK,
      message: `orders of => ${user_uuid}`,
      response: {
        orders,
        count,
      },
    };
  }
}
