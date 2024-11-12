import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'muyLargo',
  standalone: true,
})
export class MuyLargoPipe implements PipeTransform {
  transform(
    value: string,
    largoMaximo: number = 8,
    cadenaQueCorta: string = '...'
  ): string {
    let respuesta = value;

    if (value.length >= largoMaximo) {
      let respuesta = value.slice(0, largoMaximo) + cadenaQueCorta;
      return respuesta;
    }

    return value;
  }
}
