import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-cantidad-turnos-solicitados',
  imports: [RouterLink],
  templateUrl: './cantidad-turnos-solicitados.component.html',
  styleUrl: './cantidad-turnos-solicitados.component.css',
})
export class CantidadTurnosSolicitadosComponent {
  public turnosPorMedicoChart: any;
  public turnosPorMedicoChartEnteros: any;

  private coloresFijos: string[] = [
    '#FF5733',
    '#33FF57',
    '#3357FF',
    '#FFC300',
    '#C70039',
    '#900C3F',
    '#581845',
  ];

  constructor(private userService: UserService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    const fechaInicio = new Date('2024-01-01');
    const fechaFin = new Date('2024-12-31');

    this.userService.obtenerAllTurnos().then((turnos) => {
      const turnosFiltrados = turnos.filter((turno: any) => {
        const fechaTurno = new Date(turno.Fecha);
        return fechaTurno >= fechaInicio && fechaTurno <= fechaFin;
      });

      const fechas = Array.from(
        new Set(turnosFiltrados.map((turno) => turno['Fecha']))
      ).sort();

      const medicos = Array.from(
        new Set(turnosFiltrados.map((turno) => turno['nombreEspecialista']))
      );

      const datasets = medicos.map((medico, index) => {
        const data = fechas.map((fecha) => {
          return turnosFiltrados.filter(
            (turno) =>
              turno['nombreEspecialista'] === medico && turno['Fecha'] === fecha
          ).length;
        });

        return {
          label: medico,
          data: data,
          backgroundColor: this.coloresFijos[index % this.coloresFijos.length],
          borderColor: this.coloresFijos[index % this.coloresFijos.length],
          borderWidth: 1,
        };
      });

      const cantidades = medicos.map((medico) => {
        return turnosFiltrados.filter(
          (turno) => turno['nombreEspecialista'] === medico
        ).length;
      });

      this.turnosPorMedicoChartEnteros = new Chart(
        'turnosPorMedicoChartEnteros',
        {
          type: 'bar',
          data: {
            labels: medicos,
            datasets: [
              {
                label: 'Cantidad de Turnos Solicitados',
                data: cantidades,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
              },
            ],
          },
        }
      );

      this.turnosPorMedicoChart = new Chart('turnosPorMedicoChart', {
        type: 'bar',
        data: {
          labels: fechas,
          datasets: datasets,
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
    });
  }

  async descargarPDF() {
    const canvas = document.getElementById(
      'turnosPorMedicoChart'
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
    pdf.save('cantidadTurnosEspecialistas.pdf');
  }
}
