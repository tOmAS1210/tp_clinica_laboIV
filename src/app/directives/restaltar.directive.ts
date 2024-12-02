import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRestaltar]',
})
export class RestaltarDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = 'lightblue';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }

  @HostListener('click') onClick() {
    this.el.nativeElement.style.backgroundColor = 'green';
  }
}
