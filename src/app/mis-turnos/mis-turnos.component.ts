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
      alert('Por favor completa todos los datos fijos.');
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
        alert('Historia clínica guardada exitosamente.');
        turno.mostrarFormularioHistoriaClinica = false;
        turno.estadoTurno = 'finalizado';
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Error al guardar la historia clínica: ', error);
      });
  }

  // finalizarTurnoHistoriaClinica(turno: any) {
  //   Swal.fire({
  //     title: 'Historia Clínica',
  //     html: `
  //       <div>
  //         <label for="altura">Altura (cm):</label>
  //         <input id="altura" type="number" class="swal2-input" placeholder="Altura">
  //         <label for="peso">Peso (kg):</label>
  //         <input id="peso" type="number" class="swal2-input" placeholder="Peso">
  //         <label for="temperatura">Temperatura (°C):</label>
  //         <input id="temperatura" type="number" class="swal2-input" placeholder="Temperatura">
  //         <label for="presion">Presión:</label>
  //         <input id="presion" type="text" class="swal2-input" placeholder="Presión">

  //         <hr>
  //         <div id="dynamic-fields">
  //           <label>Datos adicionales</label>
  //           <div class="dynamic-field">
  //             <input type="text" class="swal2-input dynamic-key" placeholder="Clave">
  //             <input type="text" class="swal2-input dynamic-value" placeholder="Valor">
  //           </div>
  //         </div>
  //         <button id="add-field" type="button" style="margin: 10px; padding: 5px;">Agregar campo</button>
  //       </div>
  //     `,
  //     focusConfirm: false,
  //     showCancelButton: true,
  //     confirmButtonText: 'Guardar',
  //     cancelButtonText: 'Cancelar',
  //     preConfirm: () => {
  //       const altura = (document.getElementById('altura') as HTMLInputElement)
  //         .value;
  //       const peso = (document.getElementById('peso') as HTMLInputElement)
  //         .value;
  //       const temperatura = (
  //         document.getElementById('temperatura') as HTMLInputElement
  //       ).value;
  //       const presion = (document.getElementById('presion') as HTMLInputElement)
  //         .value;

  //       const dynamicKeys = Array.from(
  //         document.querySelectorAll('.dynamic-key')
  //       ) as HTMLInputElement[];
  //       const dynamicValues = Array.from(
  //         document.querySelectorAll('.dynamic-value')
  //       ) as HTMLInputElement[];

  //       const datosDinamicos: Record<string, string> = {};
  //       dynamicKeys.forEach((keyField, index) => {
  //         const key = keyField.value.trim();
  //         const value = dynamicValues[index].value.trim();
  //         if (key && value) {
  //           datosDinamicos[key] = value;
  //         }
  //       });

  //       if (!altura || !peso || !temperatura || !presion) {
  //         Swal.showValidationMessage(
  //           'Por favor, completa todos los campos fijos'
  //         );
  //         return null;
  //       }

  //       return {
  //         altura: parseFloat(altura),
  //         peso: parseFloat(peso),
  //         temperatura: parseFloat(temperatura),
  //         presion,
  //         datosDinamicos,
  //       };
  //     },
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const historiaClinica = result.value;
  //       console.log('Historia Clínica:', historiaClinica);

  //       // Lógica para guardar la historia clínica, por ejemplo:
  //       this.guardarHistoriaClinica(turno);
  //     }
  //   });

  //   // Agregar funcionalidad dinámica de campos
  //   setTimeout(() => {
  //     const addFieldButton = document.getElementById('add-field');
  //     addFieldButton?.addEventListener('click', () => {
  //       const dynamicFieldsContainer =
  //         document.getElementById('dynamic-fields');
  //       if (dynamicFieldsContainer) {
  //         const newField = document.createElement('div');
  //         newField.className = 'dynamic-field';
  //         newField.innerHTML = `
  //           <input type="text" class="swal2-input dynamic-key" placeholder="Clave">
  //           <input type="text" class="swal2-input dynamic-value" placeholder="Valor">
  //         `;
  //         dynamicFieldsContainer.appendChild(newField);
  //       }
  //     });
  //   }, 0);
  // }
}
