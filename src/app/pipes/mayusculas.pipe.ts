import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mayusculas',
})
export class MayusculasPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.toUpperCase();
  }
}
