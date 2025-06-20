import { Type } from 'class-transformer';
import { CreateExtra } from '../extras/create';
import {
  Max,
  Min,
  IsString,
  IsNumber,
  IsDefined,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  IsArray,
} from 'class-validator';

export class Create {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image_src: string;

  @IsOptional()
  @IsNumber()
  @Max(1)
  offer: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  category_id: number[];

  @IsOptional()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => CreateExtra)
  products: CreateExtra[];
}
