import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { authGuard } from '../auth.guard';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  mostrarComponente: boolean = true;

  bandera = 0;

  pacientes: boolean = false;
  especialistas: boolean = false;

  mail: string = '';
  passWord: string = '';

  arrayPacientes: any[] = [];

  arrayEspecialistas: any[] = [];

  arrayAdmin: any[] = [];

  paciente1: any = {};
  paciente2: any = {};
  paciente3: any = {};

  especialista1: any = {};
  especialista2: any = {};

  admin1: any = {};

  constructor(
    private userService: UserService,
    private router: Router,
    private authGuard: authGuard
  ) {}
  async ngOnInit() {
    this.arrayPacientes = await this.userService.getPacientes();

    this.arrayEspecialistas = await this.userService.getEspecialistas();

    this.arrayAdmin = await this.userService.getAdmin();

    this.paciente1 = this.arrayPacientes.find(
      (p) => p.email === 'paciente@yopmail.com'
    );
    this.paciente2 = this.arrayPacientes.find(
      (p) => p.email === 'pacientaso@yopmail.com'
    );
    this.paciente3 = this.arrayPacientes.find(
      (p) => p.email === 'pacientesito@yopmail.com'
    );

    this.especialista1 = this.arrayEspecialistas.find(
      (e) => e.email === 'varios@yopmail.com'
    );

    this.especialista2 = this.arrayEspecialistas.find(
      (e) => e.email === 'master@yopmail.com'
    );

    this.admin1 = this.arrayAdmin.find(
      (a) => a.email === 'administradormaximo@yopmail.com'
    );
  }

  loguearUsuario() {
    this.userService
      .login(this.mail, this.passWord)
      .then((response) => {
        //console.log(response);
        this.userService.isAuthenticated = true;

        this.authGuard.canActivate().then((isHabilitado) => {
          if (isHabilitado) {
            this.router.navigate(['/home']);
            Swal.fire({
              title: 'Good job!',
              text: 'Logueo exitoso',
              icon: 'success',
              position: 'top',
              toast: true,
              showConfirmButton: false,
              timer: 3000,
              background: '#f8d7da',
              customClass: { popup: 'my-custom-popup' },
            });
          } else {
            console.log('La cuenta no está habilitada.');
          }
        });
      })
      .catch((error) => {
        this.bandera = 1;

        this.alertCampos(error);
        console.log('Logueo fallido: ', error);
      });
  }

  alertCampos(error: any) {
    if (this.bandera === 1) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Correo o Contrasenia incorrectas, y si no es eso entonces debe verificar su cuenta desde un correo que enviamos xd',
        position: 'top',
        toast: true,
        showConfirmButton: true,
        ///timer: 3000,
        background: '#f8d7da',
        customClass: {
          popup: 'my-custom-popup',
        },
      });
    }
  }

  async getPacientes() {
    return await this.userService.getPacientes();
  }

  autoCompletarAdmin() {
    this.mail = 'administradormaximo@yopmail.com';
    this.passWord = '123456';
  }

  autoCompletarPaciente() {
    this.mail = 'paciente@yopmail.com';
    this.passWord = '123456';
  }
  autoCompletarPaciente2() {
    this.mail = 'pacientaso@yopmail.com';
    this.passWord = '123456';
  }
  autoCompletarPaciente3() {
    this.mail = 'pacientesito@yopmail.com';
    this.passWord = '123456';
  }

  autoCompletarEspecialista() {
    this.mail = 'varios@yopmail.com';
    this.passWord = '123456';
  }

  autoCompletarEspecialista2() {
    this.mail = 'master@yopmail.com';
    this.passWord = '123456';
  }
}
