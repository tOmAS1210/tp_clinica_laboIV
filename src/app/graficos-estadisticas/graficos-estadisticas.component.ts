import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { jsPDF } from 'jspdf';
import { Chart, registerables } from 'chart.js';
import { UserService } from '../services/user.service';

@Component({
  standalone: true,
  selector: 'app-graficos-estadisticas',
  imports: [RouterLink],
  templateUrl: './graficos-estadisticas.component.html',
  styleUrl: './graficos-estadisticas.component.css',
})
export class GraficosEstadisticasComponent {}
