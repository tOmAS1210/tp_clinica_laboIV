import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RestaltarDirective } from '../directives/restaltar.directive';

@Component({
  selector: 'app-bienvenido',
  imports: [RouterLink, CommonModule, RestaltarDirective],
  templateUrl: './bienvenido.component.html',
  styleUrl: './bienvenido.component.css',
})
export class BienvenidoComponent {}
