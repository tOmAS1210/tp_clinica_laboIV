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
  //horariosDisponibilidad: string[] = [];
  diasDisponibilidad: string[] = [];

  anioActual: number = new Date().getFullYear();
  mesActual: number = new Date().getMonth() + 1;
  diasDelMes: { dia: number; diaSemana: string }[] = [];

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
    }

    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('Usuario actual: ', user);
        this.nivel = await this.userService.verificarNivelUsuario(user);
        console.log('Nivel usuario: ', this.nivel);
      }
    });
  }
}
