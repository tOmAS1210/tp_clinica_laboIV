import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css'],
})
export class MisTurnosComponent implements OnInit {
  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}
  usuarioUid: {} | null = {};
  usuarioActual: any = {};
  turnosPaciente: any[] = [];
  turnosEspecialista: any[] = [];
  filtro: string = '';
  estadoTurno: string = '';
  fechaDiv: string = '';
  horaDiv: string = '';
  mostrarComentario = false;
  tipoUsuario: string = '';
  turnoAceptado = 'noAceptado';

  historiaClinica: any;

  async ngOnInit() {
    this.usuarioUid = this.userService.getUsuarioActual();

    if (this.usuarioUid) {
      this.usuarioActual = await this.userService.traerUsuarioPedido(
        this.usuarioUid
      );

      this.tipoUsuario = this.usuarioActual.nivel;

      if (this.tipoUsuario === 'Paciente') {
        this.turnosPaciente = await this.userService.obtenerTurnosPorPacientes(
          this.usuarioUid
        );
        await this.cargarHistorialesClinicos();
        this.filtrarTurnosPorUsuario();
      } else if (this.tipoUsuario === 'Especialista') {
        this.turnosEspecialista =
          await this.userService.obtenerTurnosPorEspecialista(this.usuarioUid);
        await this.cargarHistorialesClinicos();
      }
    }
  }

  filtrarTurnosPorUsuario() {
    this.turnosPaciente = this.turnosPaciente.filter(
      (turno) => turno.uidPaciente === this.usuarioActual.uid
    );
  }

  filtrarTurnosInput() {
    const terminoFiltro = this.filtro.toLowerCase();

    const filtrarDatosDinamicos = (datosDinamicos: any[]) => {
      return datosDinamicos?.some(
        (dato) =>
          dato.clave?.toLowerCase().includes(terminoFiltro) ||
          dato.valor?.toLowerCase().includes(terminoFiltro)
      );
    };

    if (this.tipoUsuario === 'Paciente') {
      return this.turnosPaciente.filter((turno) => {
        return (
          turno.especialidad.toLowerCase().includes(terminoFiltro) ||
          turno.nombreEspecialista.toLowerCase().includes(terminoFiltro) ||
          turno.historiaClinica?.altura?.toString().includes(terminoFiltro) ||
          turno.historiaClinica?.peso?.toString().includes(terminoFiltro) ||
          turno.historiaClinica?.temperatura
            ?.toString()
            .includes(terminoFiltro) ||
          turno.historiaClinica?.presion
            ?.toLowerCase()
            .includes(terminoFiltro) ||
          filtrarDatosDinamicos(turno.historiaClinica?.datosDinamicos) ||
          turno.Fecha.includes(terminoFiltro) ||
          turno.Hora.includes(terminoFiltro)
        );
      });
    } else if (this.tipoUsuario === 'Especialista') {
      return this.turnosEspecialista.filter((turno) => {
        return (
          turno.especialidad.toLowerCase().includes(terminoFiltro) ||
          turno.nombrePaciente.toLowerCase().includes(terminoFiltro) ||
          turno.historiaClinica?.altura?.toString().includes(terminoFiltro) ||
          turno.historiaClinica?.peso?.toString().includes(terminoFiltro) ||
          turno.historiaClinica?.temperatura
            ?.toString()
            .includes(terminoFiltro) ||
          turno.historiaClinica?.presion
            ?.toLowerCase()
            .includes(terminoFiltro) ||
          filtrarDatosDinamicos(turno.historiaClinica?.datosDinamicos) ||
          turno.Fecha.includes(terminoFiltro) ||
          turno.Hora.includes(terminoFiltro)
        );
      });
    }

    return [];
  }

  filtrarTurnosPorFechaYHora(fecha: string, hora: string) {
    const turnosFiltrados = this.turnosPaciente.filter(
      (turno) => turno.Fecha === fecha && turno.Hora === hora
    );
    this.historiaClinica = turnosFiltrados;
    console.log('Turnos filtrados:', turnosFiltrados);
    return turnosFiltrados;
  }

  async cargarHistorialesClinicos() {
    if (this.tipoUsuario === 'Paciente') {
      for (const turno of this.turnosPaciente) {
        if (turno.estadoTurno === 'finalizado') {
          const historialesClinicos =
            await this.userService.obtenerHistorialClinico(
              this.usuarioActual.uid
            );

          const historialCoincidente = historialesClinicos.find(
            (historial: any) =>
              historial.fechaHistoriaClinica === turno.Fecha &&
              historial.horaHistoriaClinica === turno.Hora
          );

          if (historialCoincidente) {
            turno.historiaClinica = historialCoincidente;
          }
        }
      }
    } else if (this.tipoUsuario === 'Especialista') {
      for (const turno of this.turnosEspecialista) {
        if (turno.estadoTurno === 'finalizado') {
          const historialesClinicos =
            await this.userService.obtenerHistorialClinico(turno.uidPaciente);

          const historialCoincidente = historialesClinicos.find(
            (historial: any) =>
              historial.Fecha === turno.Fecha && historial.Hora === turno.Hora
          );

          if (historialCoincidente) {
            turno.historiaClinica = historialCoincidente;
          }
        }
      }
    }
  }

  aceptarTurno(turno: any) {
    this.fechaDiv = turno.Fecha;
    this.horaDiv = turno.Hora;
    this.turnoAceptado = 'aceptado';

    this.userService
      .agregarCampoExtraTurnoEspecialista(
        //activo-cancelado-finalizado-rechazado
        this.usuarioActual.uid,
        'estadoTurno',
        'aceptado',
        this.fechaDiv,
        this.horaDiv
      )
      .then(() => {
        turno.estadoTurno = 'aceptado';

        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Error al aceptar el turno: ', error);
      });
  }

  finalizarTurno(turno: any) {
    this.fechaDiv = turno.Fecha;
    this.horaDiv = turno.Hora;
    this.turnoAceptado = 'aceptado';

    this.userService
      .agregarCampoExtraTurnoEspecialista(
        //activo-cancelado-finalizado-rechazado
        this.usuarioActual.uid,
        'estadoTurno',
        'finalizado',
        this.fechaDiv,
        this.horaDiv
      )
      .then(() => {
        turno.estadoTurno = 'finalizado';
        turno.mostrarComentario = true;

        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Error al finalizar el turno: ', error);
      });
  }

  rechazarTurno(turno: any) {
    this.fechaDiv = turno.Fecha;
    this.horaDiv = turno.Hora;
    this.turnoAceptado = 'noAceptado';

    this.userService
      .agregarCampoExtraTurnoEspecialista(
        //activo-cancelado-finalizado-rechazado
        this.usuarioActual.uid,
        'estadoTurno',
        'rechazado',
        this.fechaDiv,
        this.horaDiv
      )
      .then(() => {
        turno.estadoTurno = 'rechazado';
        turno.mostrarComentario = true;

        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Error al aceptar el turno: ', error);
      });
  }

  cancelarTurno(turno: any) {
    this.fechaDiv = turno.Fecha;
    this.horaDiv = turno.Hora;

    if (this.tipoUsuario === 'Paciente') {
      this.userService
        .agregarCampoExtraTurno(
          //activo-cancelado-finalizado-rechazado
          this.usuarioActual.uid,
          'estadoTurno',
          'cancelado',
          this.fechaDiv,
          this.horaDiv
        )
        .then(() => {
          turno.estadoTurno = 'cancelado';
          turno.mostrarComentario = true;

          this.cdr.detectChanges();
          console.log('El turno fue cancelado exitosamente');
          console.log('fecha: ', this.fechaDiv);
          console.log('hora: ', this.horaDiv);
        })
        .catch((error) => {
          console.error('Error al cancelar el turno: ', error);
        });
    } else if (this.tipoUsuario === 'Especialista') {
      this.userService
        .agregarCampoExtraTurnoEspecialista(
          //activo-cancelado-finalizado-rechazado
          this.usuarioActual.uid,
          'estadoTurno',
          'cancelado',
          this.fechaDiv,
          this.horaDiv
        )
        .then(() => {
          turno.estadoTurno = 'cancelado';
          turno.mostrarComentario = true;

          this.cdr.detectChanges();
          console.log('El turno fue cancelado exitosamente');
          console.log('fecha: ', this.fechaDiv);
          console.log('hora: ', this.horaDiv);
        })
        .catch((error) => {
          console.error('Error al cancelar el turno: ', error);
        });
    }
  }

  guardarComentario(turno: any) {
    this.fechaDiv = turno.Fecha;
    this.horaDiv = turno.Hora;
    turno.mostrarComentario = true;

    if (this.tipoUsuario === 'Paciente') {
      this.userService
        .agregarCampoExtraTurno(
          this.usuarioActual.uid,
          'comentarioCancelacionPaciente',
          turno.comentario,
          this.fechaDiv,
          this.horaDiv
        )
        .then(() => {
          console.log('Comentario guardado exitosamente: ', turno.comentario);
          turno.mostrarComentario = false;
        })
        .catch((error) => {
          console.error('Error al guardar el comentario', error);
        });
    } else if (this.tipoUsuario === 'Especialista') {
      this.userService
        .agregarCampoExtraTurnoEspecialista(
          this.usuarioActual.uid,
          'comentarioEspecialista',
          turno.comentario,
          this.fechaDiv,
          this.horaDiv
        )
        .then(() => {
          console.log('Comentario guardado exitosamente: ', turno.comentario);
          turno.mostrarComentario = false;
        })
        .catch((error) => {
          console.error('Error al guardar el comentario', error);
        });
    }
  }

  mostrarCampoCalificacion(turno: any) {
    this.turnosPaciente.forEach((t) => (t.mostrandoCalificacion = false));
    turno.mostrandoCalificacion = true;
    turno.comentarioCalificacion = '';
  }

  guardarComentarioAtencion(turno: any) {
    if (
      !turno.comentarioCalificacion ||
      turno.comentarioCalificacion.trim() === ''
    ) {
      Swal.fire({
        icon: 'error',
        title: 'POR FAVOR',
        text: 'escriba una calificacion antes de guardar',
        position: 'top',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        background: '#f8d7da',
        customClass: {
          popup: 'my-custom-popup',
        },
      });
      return;
    }

    this.fechaDiv = turno.Fecha;
    this.horaDiv = turno.Hora;

    if (this.tipoUsuario === 'Paciente') {
      this.userService
        .agregarCampoExtraTurno(
          this.usuarioActual.uid,
          'comentarioAtencionEspecialista',
          turno.comentarioCalificacion,
          this.fechaDiv,
          this.horaDiv
        )
        .then(() => {
          console.log('Calificacion guardada exitosamente ');
          turno.mostrarComentarioCalificacion = false;
        })
        .catch((error) => {
          console.error('Error al guardar la calificacion', error);
        });
    }
  }

  mostrarResenia(turno: any) {
    this.turnosPaciente.forEach(
      (turnosIndividuales) => (turnosIndividuales.resenia = false)
    );

    this.turnosEspecialista.forEach(
      (turnosIndividuales) => (turnosIndividuales.resenia = false)
    );

    turno.resenia = true;
  }

  mostrarFormularioHistoriaClinica(turno: any) {
    turno.mostrarFormularioHistoriaClinica = true;
    turno.historiaClinica = {
      altura: null,
      peso: null,
      temperatura: null,
      presion: null,
      datosDinamicos: [],
    };
  }

  agregarDatoDinamico(turno: any) {
    turno.historiaClinica.datosDinamicos.push({ clave: '', valor: '' });
  }

  eliminarDatoDinamico(turno: any, index: number) {
    turno.historiaClinica.datosDinamicos.splice(index, 1);
  }

  guardarHistoriaClinica(turno: any) {
    const historiaClinica = turno.historiaClinica;

    if (
      !historiaClinica.altura ||
      !historiaClinica.peso ||
      !historiaClinica.temperatura ||
      !historiaClinica.presion
    ) {
      Swal.fire({
        icon: 'error',
        title: 'POR FAVOR',
        text: 'complete todos los datos fijos',
        position: 'top',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        background: '#f8d7da',
        customClass: {
          popup: 'my-custom-popup',
        },
      });
      return;
    }

    this.userService
      .guardarHistoriaClinica(
        turno.uidPaciente,
        historiaClinica,
        turno.Fecha,
        turno.Hora,
        this.usuarioActual.uid,
        this.usuarioActual.nombre,
        turno.especialidad
      )
      .then(() => {
        Swal.fire({
          title: 'Buen Trabajo!',
          text: 'Historia clinica guardada exitosamente',
          icon: 'success',
          position: 'top',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          background: '#f8d7da',
          customClass: {
            popup: 'my-custom-popup',
          },
        });
        turno.mostrarFormularioHistoriaClinica = false;
        turno.estadoTurno = 'finalizado';
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Error al guardar la historia clínica: ', error);
      });
  }

  mostrarCampoEncuesta(turno: any) {
    // Asegúrate de que solo un turno a la vez muestre el campo de la encuesta
    this.turnosPaciente.forEach((t) => (t.mostrandoEncuesta = false));
    turno.mostrandoEncuesta = true;
    turno.calificacionAtencion = null; // Inicializa la calificación en null
  }

  guardarEncuesta(turno: any) {
    if (
      turno.calificacionAtencion === null ||
      turno.calificacionAtencion < 0 ||
      turno.calificacionAtencion > 10
    ) {
      Swal.fire({
        icon: 'error',
        title: 'POR FAVOR',
        text: 'ingrese una calificacion entre 0 y 10',
        position: 'top',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        background: '#f8d7da',
        customClass: {
          popup: 'my-custom-popup',
        },
      });
      return;
    }

    this.userService
      .agregarCampoExtraTurno(
        this.usuarioActual.uid,
        'calificacionAtencionEspecialista',
        turno.calificacionAtencion,
        turno.Fecha,
        turno.Hora
      )
      .then(() => {
        Swal.fire({
          title: 'Good job!',
          text: 'Calificacion guardada exitosamente',
          icon: 'success',
          position: 'top',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          background: '#f8d7da',
          customClass: {
            popup: 'my-custom-popup',
          },
        });
        turno.mostrandoEncuesta = false;
      })
      .catch((error) => {
        console.error('Error al guardar la calificación', error);
      });
  }
}

// necesito que el filtrarTurnos, ademas de filtrar por especialidad,
// nombreEspecialista y nombrePaciente, tambien filtre por fecha, hora, estado
