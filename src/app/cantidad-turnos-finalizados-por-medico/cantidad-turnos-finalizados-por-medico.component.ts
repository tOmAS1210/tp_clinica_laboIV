import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { UserService } from '../services/user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-cantidad-turnos-finalizados-por-medico',
  imports: [RouterLink],
  templateUrl: './cantidad-turnos-finalizados-por-medico.component.html',
  styleUrl: './cantidad-turnos-finalizados-por-medico.component.css',
})
export class CantidadTurnosFinalizadosPorMedicoComponent {
  public turnosFinalizadosChart: any;

  constructor(private userService: UserService) {
    Chart.register(...registerables);
  }

  async ngOnInit() {
    const turnos = await this.userService.obtenerAllTurnos();

    const turnosFinalizados = turnos.filter(
      (turno: any) => turno.estadoTurno === 'finalizado'
    );

    const medicos = Array.from(
      new Set(turnosFinalizados.map((turno) => turno['nombreEspecialista']))
    );
    const cantidades = medicos.map((medico) => {
      return turnosFinalizados.filter(
        (turno) => turno['nombreEspecialista'] === medico
      ).length;
    });

    this.turnosFinalizadosChart = new Chart('turnosFinalizadosChart', {
      type: 'bar',
      data: {
        labels: medicos,
        datasets: [
          {
            label: 'Cantidad de Turnos Finalizados',
            data: cantidades,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
    });
  }

  async descargarPDF() {
    const canvas = document.getElementById(
      'turnosFinalizadosChart'
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
    pdf.save('log_ingresos.pdf');
  }
}
