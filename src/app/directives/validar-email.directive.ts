import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appValidarEmail]',
})
export class ValidarEmailDirective {
  @HostListener('input', ['$event.target'])
  onInput(input: HTMLInputElement) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    input.style.borderColor = regex.test(input.value) ? 'green' : 'red';
  }
}
