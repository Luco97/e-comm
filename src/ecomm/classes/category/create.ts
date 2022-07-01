import { IsDefined, IsString } from 'class-validator';

export class Create {
  @IsDefined()
  @IsString()
  name: string;
}
