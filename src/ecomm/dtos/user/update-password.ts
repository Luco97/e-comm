import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePassword {
  @IsNotEmpty()
  @IsString()
  @Length(6)
  password: string;
}
