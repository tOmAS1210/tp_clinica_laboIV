import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { MiPerfilComponent } from '../mi-perfil/mi-perfil.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('slideInFromTop', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate(
          '300ms ease-in',
          style({ transform: 'translateY(-100%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  usuarioAdmin: any;
  usuarioPaciente: any;
  usuarioEspecialista: any;
  nivel: any = '';
  usuarioActual: any;
  usuarioActualCamposCompletos: any = {};

  mostrarComponente: boolean = true;

  private router = inject(Router);

  registrado = true;

  constructor(private auth: Auth, private userService: UserService) {}

  async ngOnInit() {
    this.usuarioActual = this.userService.getUsuarioActual();
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        //console.log('Usuario actual: ', user);
        this.nivel = await this.userService.verificarNivelUsuario(user);
        //console.log('Nivel usuario: ', this.nivel);
      }
    });
    this.usuarioActualCamposCompletos =
      await this.userService.traerUsuarioPedido(this.usuarioActual);
    // if (this.registrado) {
    //   this.userService.registrarIngreso();
    //   this.registrado = false;
    // }
    //console.log('id usuario actual lets go: ', this.usuarioActual);
  }

  desloguear() {
    this.userService
      .logOut()
      .then(() => {
        //this.registrado = true;
        this.userService.isAuthenticated = false;
        this.router.navigate(['/bienvenido']);
        Swal.fire({
          title: 'Good job!',
          text: 'Deslogueo exitoso',
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
      })
      .catch((error) => console.log(error));
  }
}
