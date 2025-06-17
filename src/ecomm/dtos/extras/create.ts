import {
  Max,
  Min,
  IsUrl,
  IsString,
  IsNumber,
  IsOptional,
  IsDefined,
  MaxLength,
  IsArray,
} from 'class-validator';

export class CreateExtra {
  @IsDefined()
  name: string;

  @IsDefined()
  url: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  image_src?: string[];

  // image_src: string;

  @IsOptional()
  order?: number;

  @IsOptional()
  @IsNumber()
  price_variation: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock: number;
}
