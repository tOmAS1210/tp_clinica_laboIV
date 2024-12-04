import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Chart, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-log-ingresos',
  imports: [RouterLink],
  templateUrl: './log-ingresos.component.html',
  styleUrl: './log-ingresos.component.css',
})
export class LogIngresosComponent {
  public ingresosChart: any;

  constructor(private userService: UserService) {
    Chart.register(...registerables);
  }

  async ngOnInit() {
    try {
      const { labels, cantidadIngresos } = await this.userService.obtenerLogs();

      const data = labels.map((label, index) => {
        const fecha = label.split(' - ')[1];
        const formattedDate = fecha.split('/').reverse().join('-');
        const dateObj = new Date(formattedDate);
        return { label, cantidadIngresos: cantidadIngresos[index], dateObj };
      });

      const sortedData = data.sort(
        (a, b) => a.dateObj.getTime() - b.dateObj.getTime()
      );

      const sortedLabels = sortedData.map((item) => item.label);
      const sortedCantidadIngresos = sortedData.map(
        (item) => item.cantidadIngresos
      );

      this.ingresosChart = new Chart('ingresosChart', {
        type: 'bar',
        data: {
          labels: sortedLabels,
          datasets: [
            {
              label: 'Ingresos por Usuario',
              data: sortedCantidadIngresos,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error al cargar los gráficos:', error);
    }
  }

  async descargarPDF() {
    const canvas = document.getElementById(
      'ingresosChart'
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
