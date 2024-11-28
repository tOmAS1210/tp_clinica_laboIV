import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-graficos-estadisticas',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './graficos-estadisticas.component.html',
  styleUrl: './graficos-estadisticas.component.css',
})
export class GraficosEstadisticasComponent {}
