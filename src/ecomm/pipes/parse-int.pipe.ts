import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  defaultNumber: number = 0;
  constructor(defaultNumber?: number) {
    this.defaultNumber = defaultNumber;
  }
  transform(value: string, metadata: ArgumentMetadata) {
    return +value || this.defaultNumber;
  }
}
