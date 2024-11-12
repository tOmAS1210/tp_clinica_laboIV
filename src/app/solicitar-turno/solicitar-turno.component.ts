import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css',
})
export class SolicitarTurnoComponent {
  especialidades: string[] = [];
  especialidad: string = '';
  horaTurno: string = '';
  especialistas: any[] = [];
  nombreEspecialista: string = '';

  especialistaSeleccionado: any = {};
  especialidadEspecialistaSeleccionado: string = '';

  diaSeleccionado: string = '';
  fechaTurnoSeleccionada: string | null = null;

  proximoQuinceDias: { fecha: string; nombreDia: string }[] = [];

  horarios: string[] = [];
  horarioSeleccionado: string | null = null;

  usuarioActual: any = {};

  horariosOcupados: string[] = [];

  turnoSolicitado: {
    Dia: string;
    Fecha: string;
    Hora: string;
    nombrePaciente: string;
    nombreEspecialista: string;
    especialidad: string;
    uidPaciente: string;
  } = {
    Dia: '',
    Fecha: '',
    Hora: '',
    nombrePaciente: '',
    nombreEspecialista: '',
    especialidad: '',
    uidPaciente: '',
  };
  especialistasFiltrados: any[] = [];

  constructor(private userService: UserService) {}

  async ngOnInit() {
    this.especialistas = await this.userService.getEspecialistas();
    this.especialidades = this.obtenerEspecialidadesUnicas();
    this.usuarioActual = this.userService.getUsuarioActual();
    this.especialistasFiltrados = this.especialistas;
    this.turnoSolicitado.nombrePaciente = this.usuarioActual.nombre || null;
    this.turnoSolicitado.uidPaciente = this.usuarioActual.uid;
  }

  limpiarCampos() {
    this.especialistaSeleccionado = { DiasQueAtiendo: [] };
    this.especialidadEspecialistaSeleccionado = '';
    this.nombreEspecialista = '';
    this.especialistaSeleccionado = null;
    this.diaSeleccionado = '';
    this.fechaTurnoSeleccionada = null;
    this.horarioSeleccionado = null;
    this.horarios = [];
    this.horariosOcupados = [];
    this.turnoSolicitado = {
      Dia: '',
      Fecha: '',
      Hora: '',
      nombrePaciente: this.usuarioActual.nombre || '',
      nombreEspecialista: '',
      especialidad: '',
      uidPaciente: this.usuarioActual.uid || '',
    };
    this.especialistasFiltrados = this.especialistas;

    console.log('Formulario limpiado');
  }

  obtenerEspecialidadesUnicas(): string[] {
    const especialidadesSet = new Set<string>();
    this.especialistas.forEach((especialista) => {
      especialista.especialidades.forEach((esp: string) =>
        especialidadesSet.add(esp)
      );
    });

    return Array.from(especialidadesSet);
  }

  generarHorarios() {
    const inicio = 8;
    const finSemana = this.diaSeleccionado === 'sábado' ? 14 : 19;

    const intervalo = 30;

    this.horarios = [];

    for (let hora = inicio; hora <= finSemana; hora++) {
      const horaStr = hora < 10 ? `0${hora}` : `${hora}`;
      this.horarios.push(`${horaStr}:00`);
      if (hora < finSemana) this.horarios.push(`${horaStr}:${intervalo}`);
    }
    console.log(
      `Horarios generados para ${this.diaSeleccionado}:`,
      this.horarios
    );
  }

  seleccionarHorario(horario: string) {
    this.horarioSeleccionado = horario;
    this.turnoSolicitado.Hora = horario;

    console.log('Horario seleccionado: ', horario);
  }

  diasDisponibles(diaSemana: string): boolean {
    for (
      let i = 0;
      i < this.especialistaSeleccionado.DiasQueAtiendo.length;
      i++
    ) {
      if (this.especialistaSeleccionado.DiasQueAtiendo[i] === diaSemana) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  generarProximosDias(diasNecesarios: number) {
    const hoy = new Date();
    this.proximoQuinceDias = [];

    let diasAgregados = 0;
    let incrementoDias = 0;

    while (diasAgregados < diasNecesarios) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + incrementoDias);

      const fechaFormateada = fecha.toISOString().split('T')[0];

      const diaSemana = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
      if (this.especialistaSeleccionado.DiasQueAtiendo.includes(diaSemana)) {
        this.proximoQuinceDias.push({
          fecha: fechaFormateada,
          nombreDia: diaSemana,
        });
        diasAgregados++;
      }
      incrementoDias++;
    }
  }

  estaSeleccionado(dia: { fecha: string }): boolean {
    return this.fechaTurnoSeleccionada === dia.fecha;
  }

  elegirSeleccion(dia: { fecha: string }) {
    if (this.fechaTurnoSeleccionada === dia.fecha) {
      this.fechaTurnoSeleccionada = null;
      console.log('El dia fue deseleccionado', this.fechaTurnoSeleccionada);
    } else {
      this.fechaTurnoSeleccionada = dia.fecha;
      this.generarHorarios();
      this.cargarHorariosOcupados();
      this.turnoSolicitado.Fecha = dia.fecha;
      console.log('El dia fue seleccionado', this.fechaTurnoSeleccionada);
    }
  }

  onEspecialidadSeleccionada() {
    this.especialistasFiltrados = this.especialistas.filter((especialista) =>
      especialista.especialidades.includes(
        this.especialidadEspecialistaSeleccionado
      )
    );
  }

  onEspecialistaSeleccionado() {
    this.especialistaSeleccionado = this.especialistas.find(
      (especialista) => especialista.nombre == this.nombreEspecialista
    );

    if (
      this.especialistaSeleccionado.especialidades.includes(
        this.especialidadEspecialistaSeleccionado!
      )
    ) {
      this.especialidadEspecialistaSeleccionado =
        this.especialidadEspecialistaSeleccionado;
    }

    this.generarProximosDias(15);
    console.log(this.especialistaSeleccionado);
    console.log(this.especialistaSeleccionado.DiasQueAtiendo);
  }

  async horariosTurnosOcupados() {
    const turnoExistentes = await this.userService.obtenerTurnosPorEspecialista(
      this.especialistaSeleccionado.uid
    );

    const turnoFiltrado = turnoExistentes.find(
      (turno) =>
        turno['Dia'] === this.turnoSolicitado.Dia &&
        turno['Hora'] === this.turnoSolicitado.Hora &&
        turno['nombreEspecialista'] === this.turnoSolicitado.nombreEspecialista
    );
  }

  async cargarHorariosOcupados() {
    if (this.fechaTurnoSeleccionada && this.especialistaSeleccionado) {
      this.horariosOcupados = await this.userService.obtenerTurnosOcupados(
        this.especialistaSeleccionado.uid,
        this.fechaTurnoSeleccionada
      );
      console.log('Entra a este if siquiera?');
    }
    console.log('HorarioOcupado: ', this.fechaTurnoSeleccionada);
    console.log('Array horarios Ocupados: ', this.horariosOcupados);
  }

  async sacarTurno() {
    this.usuarioActual = this.userService.getUsuarioActual();
    // this.turnoSolicitado.especialidad = this.especialidad;
    this.turnoSolicitado.especialidad =
      this.especialidadEspecialistaSeleccionado;
    this.turnoSolicitado.Dia = this.diaSeleccionado;

    this.turnoSolicitado.nombreEspecialista = this.nombreEspecialista || '';

    try {
      const turnoExistentes =
        await this.userService.obtenerTurnosPorEspecialista(
          this.especialistaSeleccionado.uid
        );

      const turnoFiltrado = turnoExistentes.find(
        (turno) =>
          turno['Dia'] === this.turnoSolicitado.Dia &&
          turno['Hora'] === this.turnoSolicitado.Hora &&
          turno['Fecha'] === this.turnoSolicitado.Fecha &&
          turno['nombreEspecialista'] ===
            this.turnoSolicitado.nombreEspecialista
      );

      console.log('Turno filtrado', turnoFiltrado);

      console.log(
        'Turnos obtenidos de la bd de un mismo especialista: ',
        turnoExistentes
      );

      if (turnoFiltrado) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Parece que ese turno con ese especialista ya está ocupado, elige otro horario.',
          position: 'top',
          toast: true,
          showConfirmButton: true,
          background: '#f8d7da',
          customClass: {
            popup: 'my-custom-popup',
          },
        });
        return;
      } else {
        await this.userService.agregarTurno(
          this.especialistaSeleccionado.uid,
          this.turnoSolicitado
        );

        Swal.fire({
          icon: 'success',
          title: 'Turno reservado con éxito',
          text: 'Tu turno ha sido reservado.',
          position: 'top',
          toast: true,
          showConfirmButton: true,
          background: '#d4edda',
        });
      }
    } catch (error) {
      console.error('Error al verificar o reservar el turno:', error);
    }
  }
}
