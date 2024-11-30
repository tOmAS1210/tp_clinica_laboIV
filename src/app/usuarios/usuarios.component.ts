import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent implements OnInit {
  pacientes: any[] = [];
  historialesClinicos: any[] = [];

  constructor(private userService: UserService) {}

  async ngOnInit() {
    this.pacientes = await this.userService.getPacientes();
    this.cargarHistorialesClinicos();
  }

  async cargarHistorialesClinicos(): Promise<void> {
    for (const paciente of this.pacientes) {
      const historiales = await this.userService.obtenerHistorialClinico(
        paciente.uid
      );
      if (historiales && historiales.length > 0) {
        historiales.forEach((historial: any) => {
          this.historialesClinicos.push({
            pacienteUid: paciente.uid,
            historial,
          });
        });
      } else {
        // console.log(
        //   `No se encontraron historiales para el paciente con UID: ${paciente.uid}`
        // );
      }
    }
  }

  tieneHistorial(pacienteUid: string): boolean {
    return this.historialesClinicos.some(
      (historia) => historia.pacienteUid === pacienteUid
    );
  }

  descargarInformacionCompleta(paciente: any): void {
    console.log(
      'Paciente a descargar su historial: ',
      JSON.stringify(paciente, null, 2)
    );

    if (!paciente || !paciente.nombre || !paciente.apellido) {
      console.error('Faltan datos esenciales del paciente.');
      return;
    }

    const historiales = this.historialesClinicos
      .filter((historia) => historia.pacienteUid === paciente.uid)
      .map((historia, index) => ({
        Nombre: paciente.nombre,
        Apellido: paciente.apellido,
        Altura: historia.historial.altura,
        Peso: historia.historial.peso,
        Temperatura: historia.historial.temperatura,
        Presión: historia.historial.presion,
        Datos_Dinámicos: historia.historial.datosDinamicos
          ? historia.historial.datosDinamicos
              .map((dato: any) => `${dato.clave}: ${dato.valor}`)
              .join(', ')
          : 'N/A',
        Número_Historial: index + 1,
      }));

    if (historiales.length === 0) {
      console.warn(
        'No se encontraron historiales clínicos para este paciente.'
      );
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Este paciente no tiene un historial clinico',
        position: 'top',
        toast: true,
        showConfirmButton: true,
        ///timer: 3000,
        background: '#f8d7da',
        customClass: {
          popup: 'my-custom-popup',
        },
      });
      return;
    }

    const datosPaciente = [
      {
        Nombre: paciente.nombre,
        Apellido: paciente.apellido,
        Altura: paciente.altura || '↓',
        Peso: paciente.peso || '↓',
        Temperatura: paciente.temperatura || '↓',
        Presión: paciente.presion || '↓',
        Datos_Dinámicos: '↓',
        Número_Historial: '↓',
      },
    ];

    const datosExcel = [...datosPaciente, ...historiales];

    console.log(
      'Datos completos del paciente (incluyendo historiales): ',
      JSON.stringify(datosExcel, null, 2)
    );

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExcel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos del Paciente');

    const fechaHora = new Date().toISOString().replace(/[-T:.]/g, '_');
    const nombreArchivo = `${paciente.nombre}_${paciente.apellido}_Historial_${fechaHora}.xlsx`;

    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(blob, nombreArchivo);
  }
}
