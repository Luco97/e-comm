import { IsNumber, IsString } from 'class-validator';

export class Create {
  @IsNumber({}, { each: true })
  products: number[];

  @IsString()
  city: string;

  @IsString()
  address: string;

  @IsString()
  council: string;
}
