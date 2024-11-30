import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-pacientes',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css',
})
export class PacientesComponent implements OnInit {
  pacientes: any[] = [];
  historialesClinicos: any[] = [];
  allPacientes: any[] = [];
  usuarioActual: any;

  pacienteSeleccionado: any = null;
  turnos: any[] = [];
  usuarioActualCamposCompletos: any;

  constructor(private userService: UserService) {}

  async ngOnInit() {
    this.usuarioActual = this.userService.getUsuarioActual();
    this.usuarioActualCamposCompletos =
      await this.userService.traerUsuarioPedido(this.usuarioActual);

    this.allPacientes = await this.userService.getPacientes();
    this.pacientes = [];

    for (const paciente of this.allPacientes) {
      const historiales =
        await this.userService.obtenerHistorialClinicoEspecialista(
          paciente.uid,
          this.usuarioActual.uid
        );

      if (historiales && historiales.length > 0) {
        this.pacientes.push(paciente);
        historiales.forEach((historial: any) => {
          this.historialesClinicos.push({
            pacienteUid: paciente.uid,
            historial,
          });
        });
      }
    }
  }

  tieneHistorial(pacienteUid: string): boolean {
    return this.historialesClinicos.some(
      (historia) => historia.pacienteUid === pacienteUid
    );
  }

  obtenerHistorialesDelPaciente(uid: string): any[] {
    return this.historialesClinicos.filter(
      (historia) => historia.pacienteUid === uid
    );
  }

  seleccionarPaciente(paciente: any) {
    this.pacienteSeleccionado = paciente;

    this.userService.obtenerTurnosPorPacientes(paciente).then((turnos) => {
      this.turnos = turnos.filter(
        (turno: any) =>
          (turno.calificacionAtencionEspecialista ||
            turno.comentarioEspecialista) &&
          turno.nombreEspecialista === this.usuarioActualCamposCompletos.nombre // Filtrar solo los turnos del especialista actual
      );
    });
  }

  esTurnoYHistorialCoinciden(turno: any, historiaClinica: any): boolean {
    const turnoFecha = new Date(turno.Fecha + ' ' + turno.Hora);
    const historiaFecha = new Date(
      historiaClinica.historial.fechaHistoriaClinica +
        ' ' +
        historiaClinica.historial.horaHistoriaClinica
    );

    return turnoFecha.getTime() === historiaFecha.getTime();
  }
}

// isTurnoCorrespondiente(turno: any, historiaClinica: any): boolean {
//   const turnoFecha = new Date(turno.Fecha);
//   const turnoHora = turno.Hora;
//   const historialFecha = new Date(
//     historiaClinica.historial.fechaHistoriaClinica
//   );
//   const historialHora = historiaClinica.historial.horaHistoriaClinica;

//   // Compara la fecha y la hora de ambos
//   return (
//     turnoFecha.getDate() === historialFecha.getDate() &&
//     turnoFecha.getMonth() === historialFecha.getMonth() &&
//     turnoFecha.getFullYear() === historialFecha.getFullYear() &&
//     turnoHora === historialHora
//   );
// }
