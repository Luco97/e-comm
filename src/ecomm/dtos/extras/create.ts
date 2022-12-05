import {
  Max,
  Min,
  IsUrl,
  IsString,
  IsNumber,
  IsOptional,
  IsDefined,
  MaxLength,
} from 'class-validator';

export class CreateExtra {
  @IsDefined()
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

  @IsDefined()
  @IsNumber()
  @Min(0)
  stock: number;
}
