import {
  Min,
  IsInt,
  IsNumber,
  IsString,
  IsDefined,
  IsLatitude,
  IsLongitude,
  ArrayMinSize,
  ArrayNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

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

  @IsOptional()
  @IsInt()
  extra_id: number = 0;

  @IsDefined()
  @IsInt()
  @Min(1)
  quantity: number;
}
