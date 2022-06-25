import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsDefined,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNumber,
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

  @IsNumber()
  @IsLatitude()
  latitude: number;

  @IsNumber()
  @IsLongitude()
  longitude: number;
}

export class Product {
  @IsDefined()
  @IsInt()
  product_id: number;

  @IsDefined()
  @IsInt()
  @Min(1)
  quantity: number;
}
