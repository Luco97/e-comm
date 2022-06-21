import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsDefined,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class Create {
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => Product)
  products: Product[];

  @IsString()
  city: string;

  @IsString()
  address: string;

  @IsString()
  council: string;
}

class Product {
  @IsDefined()
  @IsInt()
  product_id: number;

  @IsDefined()
  @IsInt()
  @Min(1)
  quantity: number;
}
