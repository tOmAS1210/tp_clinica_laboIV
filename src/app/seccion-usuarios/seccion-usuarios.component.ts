import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { Auth, user } from '@angular/fire/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seccion-usuarios',
  imports: [RouterLink, FormsModule, CommonModule, RouterLink],
  templateUrl: './seccion-usuarios.component.html',
  styleUrl: './seccion-usuarios.component.css',
})
export class SeccionUsuariosComponent implements OnInit {
  listaEspecialistas: any[] = [];

  user: any;

  nombre: string = '';
  apellido: string = '';
  edad: number = 0;
  dni: string = '';
  mail: string = '';
  passWord: string = '';
  nivel: string = 'Administrador';

  selectedFile: any;
  selectedFile2: any;

  constructor(private userService: UserService, private auth: Auth) {}

  ngOnInit(): void {
    this.traerCuentasEspecialistas();

    this.user = this.userService.getUsuarioActual();
    console.log('Usuario actual: ', this.user);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      console.log('Archivo seleccionado: ', this.selectedFile);
    }
  }

  onFileSelected2(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile2 = input.files[0];

      console.log('Archivo seleccionado: ', this.selectedFile);
    }
  }

  registarAdmin() {
    const dniRegex = /^\d{8}$/;
    if (!dniRegex.test(this.dni)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El DNI debe contener exactamente 8 números.',
        position: 'top',
        toast: true,
        showConfirmButton: true,
        background: '#f8d7da',
        customClass: {
          popup: 'my-custom-popup',
        },
      });
      return;
    }

    if (!(this.nombre.length > 2)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ingrese un nombre antes de intentar registrarse',
        position: 'top',
        toast: true,
        showConfirmButton: true,
        background: '#f8d7da',
        customClass: {
          popup: 'my-custom-popup',
        },
      });
      return;
    }

    if (!(this.apellido.length > 2)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ingrese un apellido antes de intentar registrarse',
        position: 'top',
        toast: true,
        showConfirmButton: true,
        background: '#f8d7da',
        customClass: {
          popup: 'my-custom-popup',
        },
      });
      return;
    }

    if (!(this.edad > 17 && this.edad < 100)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Su edad debe estar entre los 18 y 99 anios.',
        position: 'top',
        toast: true,
        showConfirmButton: true,
        background: '#f8d7da',
        customClass: {
          popup: 'my-custom-popup',
        },
      });
      return;
    }

    if (this.selectedFile && this.selectedFile2) {
      this.userService
        .registerAdmin(
          this.mail,
          this.passWord,
          this.nombre,
          this.apellido,
          this.edad,
          this.dni,
          this.selectedFile,
          this.selectedFile2,
          this.nivel
        )
        .then((response) => {
          Swal.fire({
            title: 'Good job!',
            text: 'Admin creado satisfactoriamente',
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
          console.log('Usuario actual: ', this.user);
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No podra crear su cuenta sin antes elegir una foto para su perfil',
        position: 'top',
        toast: true,
        showConfirmButton: true,
        background: '#f8d7da',
        customClass: {
          popup: 'my-custom-popup',
        },
      });
    }
  }

  traerCuentasEspecialistas() {
    this.userService
      .getEspecialistas()
      .then((especialistas) => {
        this.listaEspecialistas = especialistas;
        //console.log(this.listaEspecialistas);
      })
      .catch((error) => {
        console.error('Error al obtener especialistas: ', error);
      });
  }

  // cuentaActual() {
  //   console.log(this.userService.getUsuarioActual());
  // }

  async habilitarCuentas(usuario: any) {
    this.userService.HabilitacionCuentas(usuario);
  }
}
