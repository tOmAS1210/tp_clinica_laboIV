import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
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
        this.filtrarTurnosPorUsuario();
      } else if (this.tipoUsuario === 'Especialista') {
        this.turnosEspecialista =
          await this.userService.obtenerTurnosPorEspecialista(this.usuarioUid);
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
    if (this.tipoUsuario === 'Paciente') {
      return this.turnosPaciente.filter((turno) => {
        return (
          turno.especialidad.toLowerCase().includes(terminoFiltro) ||
          turno.nombreEspecialista.toLowerCase().includes(terminoFiltro)
        );
      });
    } else if (this.tipoUsuario === 'Especialista') {
      return this.turnosEspecialista.filter(
        (turno) =>
          turno.especialidad.toLowerCase().includes(terminoFiltro) ||
          turno.nombrePaciente.toLowerCase().includes(terminoFiltro)
      );
    }
    return [];
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
          'comentarioCancelacionEspecialista',
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

  mostrarResenia(turno: any) {
    this.turnosPaciente.forEach(
      (turnosIndividuales) => (turnosIndividuales.resenia = false)
    );

    this.turnosEspecialista.forEach(
      (turnosIndividuales) => (turnosIndividuales.resenia = false)
    );

    turno.resenia = true;
  }
}
