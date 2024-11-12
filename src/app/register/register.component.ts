import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { NgxCaptchaModule } from 'ngx-captcha'; // Usamos ngx-captcha
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    NgxCaptchaModule,
    RecaptchaModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Añadir esto si el captcha es un web component
})
export class RegisterComponent {
  pacientes: boolean = false;
  especialistas: boolean = false;

  nombre: string = '';
  apellido: string = '';
  edad: number = 0;
  dni: string = '';
  obraSocial: string = '';
  mail: string = '';
  passWord: string = '';
  imagenesPerfil: any[] = [];

  especialidadesSeleccionadas: string[] = [];
  especialidad: string = '';

  nivelPaciente: string = 'Paciente';
  nivelEspecialista: string = 'Especialista';
  nivelAdministrador: string = 'Administrador';

  selectedFile: File | null = null;
  selectedFile2: File | null = null;

  captcha: string = '';
  validacionCaptcha: boolean = false;

  constructor(private userService: UserService, private router: Router) {}
  bandera = 0;

  resolved(captchaResponse: any) {
    this.captcha = captchaResponse;
    this.validacionCaptcha = true;
    console.log(`Captcha response: ${captchaResponse}`);
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

  agregarEspecialidad() {
    if (
      this.especialidad &&
      !this.especialidadesSeleccionadas.includes(this.especialidad)
    ) {
      this.especialidadesSeleccionadas.push(this.especialidad);
      this.especialidad = '';
    }
  }

  mostrarRegistroPacientes() {
    this.pacientes = true;
    this.especialistas = false;
  }

  mostrarRegistroEspecialistas() {
    this.especialistas = true;
    this.pacientes = false;
  }

  registrarUsuario() {
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

    if (!(this.obraSocial.length === 6) && this.pacientes) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'La obra social debe contener exactamente 6 numeros.',
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

    if (!(this.edad >= 0 && this.edad < 100)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'La edad del paciente debe ser entre 0 y 99.',
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

    if (this.validacionCaptcha === true) {
      if (this.pacientes == true) {
        if (this.selectedFile && this.selectedFile2) {
          this.userService
            .registerPaciente(
              this.mail,
              this.passWord,
              this.nombre,
              this.apellido,
              this.edad,
              this.dni,
              this.obraSocial,
              this.selectedFile,
              this.selectedFile2,
              this.nivelPaciente
            )
            .then((response) => {
              Swal.fire({
                title: 'Good job!',
                text: 'Registro y login exitoso',
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
              this.router.navigate(['/login']);
            })
            .catch((error) => {
              this.bandera = 1;
              this.alertCampos(error);
              console.log(error);
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
      } else if (this.especialistas == true) {
        if (this.selectedFile) {
          this.userService
            .registerEspecialista(
              this.mail,
              this.passWord,
              this.nombre,
              this.apellido,
              this.edad,
              this.dni,
              this.especialidadesSeleccionadas,
              this.selectedFile,
              this.nivelEspecialista
            )
            .then((response) => {
              Swal.fire({
                title: 'Good job!',
                text: 'Registro y login exitoso',
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
              this.router.navigate(['/home']);
            })
            .catch((error) => {
              this.bandera = 1;
              this.alertCampos(error);
              console.log(error);
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
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Antes de intentar registrarse, primero verifique que es un humano',
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

  alertCampos(error: any) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (this.passWord.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Contrasenia demasiado corta, minimo 6 caracteres',
        position: 'top',
        toast: true,
        showConfirmButton: true,
        background: '#f8d7da',
        customClass: {
          popup: 'my-custom-popup',
        },
      });
    } else if (!emailPattern.test(this.mail)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Verifique la validez de su correo',
        position: 'top',
        toast: true,
        showConfirmButton: true,
        background: '#f8d7da',
        customClass: {
          popup: 'my-custom-popup',
        },
      });
    } else if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Parece que este correo ya esta registrado en la pagina',
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
}
