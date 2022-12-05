import {
  IsDefined,
  Min,
  Max,
  IsUrl,
  IsNumber,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class UpdateExtra {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  key: string;

  @IsOptional()
  @IsUrl()
  image_src: string;

  @IsOptional()
  @IsNumber()
  @Max(1)
  price_variation: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock: number;
}
