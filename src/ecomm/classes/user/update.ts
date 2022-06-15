import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class Update {
  @IsNotEmpty()
  @IsString()
  @Length(6)
  password: string;

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
