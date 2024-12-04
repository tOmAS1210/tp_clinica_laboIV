import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { UserService } from '../services/user.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-cantidad-turnos-especialidad',
  imports: [RouterLink],
  templateUrl: './cantidad-turnos-especialidad.component.html',
  styleUrl: './cantidad-turnos-especialidad.component.css',
})
export class CantidadTurnosEspecialidadComponent {
  public turnosPorEspecialidadChart: any;

  constructor(private userService: UserService) {
    Chart.register(...registerables);
  }

  async ngOnInit() {
    try {
      const turnos = await this.userService.obtenerAllTurnos();

      const especialidades = Array.from(
        new Set(turnos.map((item: any) => item.especialidad))
      );

      const cantidades = especialidades.map((especialidad) => {
        return turnos.filter(
          (turno: any) => turno.especialidad === especialidad
        ).length;
      });

      this.turnosPorEspecialidadChart = new Chart(
        'turnosPorEspecialidadChart',
        {
          type: 'bar',
          data: {
            labels: especialidades,
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
        }
      );
    } catch (error) {
      console.error('Error al obtener los turnos:', error);
    }
  }

  async descargarPDF() {
    const canvas = document.getElementById(
      'turnosPorEspecialidadChart'
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
    pdf.save('cantidadTurnosEspecialidad.pdf');
  }
}
