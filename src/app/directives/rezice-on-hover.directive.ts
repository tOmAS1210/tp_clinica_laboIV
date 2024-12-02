import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appReziceOnHover]',
})
export class ReziceOnHoverDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.fontSize = '1.2em';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.fontSize = '';
  }
}
