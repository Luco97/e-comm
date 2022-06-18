import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Update {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  image_src: string;
}
