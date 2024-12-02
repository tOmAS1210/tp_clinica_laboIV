import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizar',
})
export class CapitalizarPipe implements PipeTransform {
  transform(value: string): string {
    return value
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
