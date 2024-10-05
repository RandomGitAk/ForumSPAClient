import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'content',
  standalone: true
})
export class ContentPipe implements PipeTransform {

  transform(
    value: string,
    maxLength: number = 16,
    ellipsis: string = '...'
  ): unknown {
    if (value.length > maxLength) {
      return value.slice(0, maxLength) + ellipsis;
    }

    return value;
  }

}
