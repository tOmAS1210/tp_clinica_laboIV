import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css',
})
export class TurnosComponent implements OnInit {
  usuarioUid: {} | null = {};
  usuarioActual: any = {};
  allTurnos: any[] = [];
  turnosEspecialista: any[] = [];
  filtro: string = '';
  estadoTurno: string = '';
  fechaDiv: string = '';
  horaDiv: string = '';
  mostrarComentario = false;
  tipoUsuario: string = '';
  turnoAceptado = 'noAceptado';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.usuarioUid = this.userService.getUsuarioActual();

    if (this.usuarioUid) {
      this.usuarioActual = await this.userService.traerUsuarioPedido(
        this.usuarioUid
      );

      this.tipoUsuario = this.usuarioActual.nivel;

      this.allTurnos = await this.userService.obtenerAllTurnos();
    }
  }

  cancelarTurno(turno: any) {
    this.fechaDiv = turno.Fecha;
    this.horaDiv = turno.Hora;

    this.userService
      .agregarCampoExtraTurno(
        //activo-cancelado-finalizado-rechazado
        turno.uidPaciente,
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

  filtrarTurnosInput() {
    const terminoFiltro = this.filtro.toLowerCase();
    return this.allTurnos.filter((turno) => {
      return (
        turno.especialidad.toLowerCase().includes(terminoFiltro) ||
        turno.nombreEspecialista.toLowerCase().includes(terminoFiltro)
      );
    });
  }

  guardarComentario(turno: any) {
    this.fechaDiv = turno.Fecha;
    this.horaDiv = turno.Hora;

    this.userService
      .agregarCampoExtraTurno(
        turno.uidPaciente,
        'comentarioCancelacionAdmin',
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
