import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { UserService } from '../services/user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-cantidad-turnos-dia',
  imports: [RouterLink],
  templateUrl: './cantidad-turnos-dia.component.html',
  styleUrl: './cantidad-turnos-dia.component.css',
})
export class CantidadTurnosDiaComponent {
  public turnosPorDiaChart: any;

  constructor(private userService: UserService) {
    Chart.register(...registerables);
  }

  async ngOnInit() {
    try {
      const turnos = await this.userService.obtenerAllTurnos();

      const turnosPorDia: { [key: string]: number } = {};

      turnos.forEach((turno: any) => {
        const fechaUtc = new Date(turno.Fecha);
        const dia = fechaUtc.getUTCDate().toString().padStart(2, '0');
        const mes = (fechaUtc.getUTCMonth() + 1).toString().padStart(2, '0');
        const año = fechaUtc.getUTCFullYear();

        const fecha = `${dia}/${mes}/${año}`;

        turnosPorDia[fecha] = (turnosPorDia[fecha] || 0) + 1;
      });

      const fechas = Object.keys(turnosPorDia);
      const cantidades = Object.values(turnosPorDia);

      this.turnosPorDiaChart = new Chart('turnosPorDiaChart', {
        type: 'bar',
        data: {
          labels: fechas,
          datasets: [
            {
              label: 'Cantidad de Turnos',
              data: cantidades,
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error al obtener los turnos:', error);
    }
  }

  async descargarPDF() {
    const canvas = document.getElementById(
      'turnosPorDiaChart'
    ) as HTMLCanvasElement;

    if (!canvas) {
      console.error('Canvas no encontrado');
      return;
    }

    // Capturar el gráfico como imagen
    const canvasImage = await html2canvas(canvas);
    const imageData = canvasImage.toDataURL('image/png');

    // Crear el PDF
    const pdf = new jsPDF('landscape', 'px', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvasImage.height * pdfWidth) / canvasImage.width;

    pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('log_ingresos.pdf');
  }
}
