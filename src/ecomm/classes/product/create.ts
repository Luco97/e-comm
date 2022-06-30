import {
  Max,
  Min,
  IsString,
  IsNumber,
  IsDefined,
  IsOptional,
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
  @IsNumber()
  @Min(1)
  category_id: number;
}
