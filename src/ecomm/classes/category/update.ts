import { IsDefined, IsString } from 'class-validator';

export class Update {
  @IsDefined()
  @IsString()
  name: string;
}
