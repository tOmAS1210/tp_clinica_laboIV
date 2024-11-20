import { Component, Inject, Input, input, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css',
})
export class MiPerfilComponent implements OnInit {
  usuarioUID: any | null = {};
  usuarioActual: any = {};
  especialidadesUsuario: string[] = [];
  nivel: any;
  diasDisponibilidad: string[] = [];

  anioActual: number = new Date().getFullYear();
  mesActual: number = new Date().getMonth() + 1;
  diasDelMes: { dia: number; diaSemana: string }[] = [];

  historialClinico: any[] = [];
  historialesPorEspecialidad: { [especialidad: string]: any[] } = {};

  constructor(
    private userService: UserService,
    @Inject(Auth) private auth: Auth
  ) {}

  agregarDiasDisponibles(dia: string) {
    const diaIndex = this.diasDisponibilidad.indexOf(dia);

    if (!this.diasDisponibilidad.includes(dia)) {
      this.diasDisponibilidad.push(dia);
      console.log('Fecha agregada:', dia);
    } else {
      this.diasDisponibilidad.splice(diaIndex, 1);
      console.log('Fecha removida:', dia);
    }
  }

  estaSeleccionado(dia: string): boolean {
    return this.diasDisponibilidad.includes(dia);
  }

  agregarDiasDeAtencionEspecialista() {
    this.userService.agregarCampoExtraEspecialista(
      this.usuarioActual.uid,
      'DiasQueAtiendo',
      this.diasDisponibilidad
    );
  }

  async ngOnInit() {
    this.usuarioUID = this.userService.getUsuarioActual(); //de aca obtengo el uid

    if (this.usuarioUID && this.usuarioUID.uid) {
      this.usuarioActual = await this.userService.traerUsuarioPedido(
        this.usuarioUID
      );

      if (this.usuarioActual && this.usuarioActual.especialidades?.length) {
        this.especialidadesUsuario = this.usuarioActual.especialidades;
      }
      console.log('el usuario actual para mi perfil es:', this.usuarioActual);

      this.historialClinico = await this.userService.obtenerHistorialClinico(
        this.usuarioActual.uid
      );
      console.log('Historial clinico: ', this.historialClinico);
    }

    this.historialClinico = this.historialClinico.map((historia) => ({
      ...historia,
      visible: false, // Inicialmente, todos los historiales están ocultos
    }));

    this.historialClinicoSeparados();

    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('Usuario actual: ', user);
        this.nivel = await this.userService.verificarNivelUsuario(user);
        console.log('Nivel usuario: ', this.nivel);
      }
    });
  }

  historialClinicoSeparados() {
    this.historialesPorEspecialidad = this.historialClinico.reduce(
      (acc, historia) => {
        const especialidad = historia.especialidadEspecialista;
        if (!acc[especialidad]) {
          acc[especialidad] = [];
        }
        acc[especialidad].push(historia);
        return acc;
      },
      {}
    );
  }

  toggleVisibilidad(historia: any) {
    historia.visible = !historia.visible;
  }

  get especialidades(): string[] {
    return Object.keys(this.historialesPorEspecialidad);
  }
}
