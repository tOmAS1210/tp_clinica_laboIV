import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ocultarCaracteres',
})
export class OcultarCaracteresPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const [usuario, dominio] = value.split('@');

    if (!dominio) return value;

    const usuarioOcultado =
      usuario.slice(0, 2) + '*'.repeat(usuario.length - 2);

    return `${usuarioOcultado}@${dominio}`;
  }
}
