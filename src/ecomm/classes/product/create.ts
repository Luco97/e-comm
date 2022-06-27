import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class Create {
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
}
