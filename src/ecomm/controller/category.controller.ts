import {
  Get,
  Post,
  Put,
  Body,
  Res,
  Param,
  Delete,
  Controller,
  HttpStatus,
  ParseIntPipe,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';

import { Response } from 'express';
import { from, tap, mergeMap, of } from 'rxjs';

import { response } from '@ecomm/interfaces';
import { Create, Update } from '@ecomm/dtos/category';
import { CategoryEntityService } from '@database/models/category';
import { RoleGuard } from '../../guards/role.guard';

@Controller('category')
export class CategoryController {
  constructor(private _categoryEntityService: CategoryEntityService) {}

  @Get()
  findAll(@Res() resp: Response<response>) {
    // from(this._categoryEntityService.findAll())
    //   .pipe(
    //     tap((response) =>
    //       resp
    //         .status(HttpStatus.OK)
    //         .json({ status: HttpStatus.OK, message: 'find All', response }),
    //     ),
    //   )
    //   .subscribe();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() resp: Response<response>,
  ) {
    // from(this._categoryEntityService.findOne(id))
    //   .pipe(
    //     tap((response) =>
    //       resp
    //         .status(HttpStatus.OK)
    //         .json({ status: HttpStatus.OK, message: 'find One', response }),
    //     ),
    //   )
    //   .subscribe();
  }

  @Post()
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  create(@Body() createBody: Create, @Res() resp: Response<response>) {
    // from(
    //   this._categoryEntityService.create({
    //     name: createBody.name.toLowerCase(),
    //   }),
    // )
    //   .pipe(
    //     tap((response) =>
    //       resp.status(HttpStatus.CREATED).json({
    //         status: HttpStatus.CREATED,
    //         message: 'created category',
    //         response,
    //       }),
    //     ),
    //   )
    //   .subscribe();
  }

  @Put(':id')
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBody: Update,
    @Res() resp: Response<response>,
  ) {
    // from(this._categoryEntityService.findOne(id))
    //   .pipe(
    //     mergeMap((category) =>
    //       category
    //         ? from(
    //             this._categoryEntityService.create({
    //               id,
    //               name: updateBody.name.toLowerCase(),
    //             }),
    //           ).pipe(
    //             tap(() =>
    //               resp.status(HttpStatus.OK).json({
    //                 status: HttpStatus.OK,
    //                 message: 'category updated',
    //               }),
    //             ),
    //           )
    //         : of<response>({
    //             status: HttpStatus.NOT_FOUND,
    //             message: 'category not found',
    //           }).pipe(tap((data) => resp.status(data.status).json(data))),
    //     ),
    //   )
    //   .subscribe();
  }

  @Delete(':id')
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Res() resp: Response<response>,
  ) {
    // from(this._categoryEntityService.findOne(id))
    //   .pipe(
    //     mergeMap((category) =>
    //       category
    //         ? from(this._categoryEntityService.delete(id)).pipe(
    //             tap(() =>
    //               resp.status(HttpStatus.OK).json({
    //                 status: HttpStatus.OK,
    //                 message: 'category deleted',
    //               }),
    //             ),
    //           )
    //         : of<response>({
    //             status: HttpStatus.NOT_FOUND,
    //             message: 'category not found',
    //           }).pipe(tap((data) => resp.status(data.status).json(data))),
    //     ),
    //   )
    //   .subscribe();
  }
}
