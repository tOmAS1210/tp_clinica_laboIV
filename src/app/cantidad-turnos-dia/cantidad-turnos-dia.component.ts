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

      // Ordena las fechas en formato dd/MM/yyyy
      const fechasOrdenadas = Object.keys(turnosPorDia).sort((a, b) => {
        const [diaA, mesA, añoA] = a.split('/').map(Number);
        const [diaB, mesB, añoB] = b.split('/').map(Number);

        return (
          new Date(añoA, mesA - 1, diaA).getTime() -
          new Date(añoB, mesB - 1, diaB).getTime()
        );
      });

      const cantidadesOrdenadas = fechasOrdenadas.map(
        (fecha) => turnosPorDia[fecha]
      );

      this.turnosPorDiaChart = new Chart('turnosPorDiaChart', {
        type: 'bar',
        data: {
          labels: fechasOrdenadas,
          datasets: [
            {
              label: 'Cantidad de Turnos',
              data: cantidadesOrdenadas,
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Fechas',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Cantidad de Turnos',
              },
              beginAtZero: true,
            },
          },
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

    const canvasImage = await html2canvas(canvas);
    const imageData = canvasImage.toDataURL('image/png');

    const pdf = new jsPDF('landscape', 'px', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvasImage.height * pdfWidth) / canvasImage.width;

    pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('cantidadTurnosDia.pdf');
  }
}
