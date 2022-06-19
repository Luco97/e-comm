import { IsNumber } from 'class-validator';

export class Create {
  @IsNumber({}, { each: true })
  products: number[];
}
