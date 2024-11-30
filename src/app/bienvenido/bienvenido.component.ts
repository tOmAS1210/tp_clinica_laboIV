import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-bienvenido',
    imports: [RouterLink, CommonModule],
    templateUrl: './bienvenido.component.html',
    styleUrl: './bienvenido.component.css'
})
export class BienvenidoComponent {}
