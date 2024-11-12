import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const user = this.auth.currentUser;

    if (user) {
      // Verifica en cada colección si el usuario existe y obtiene el documento correspondiente
      const adminDocRef = doc(this.firestore, 'Administrador', user.uid);
      const especialistaDocRef = doc(this.firestore, 'Especialistas', user.uid);
      const pacienteDocRef = doc(this.firestore, 'Pacientes', user.uid);

      // Verifica si el usuario está en la colección de Administradores
      const adminDocSnap = await getDoc(adminDocRef);
      if (adminDocSnap.exists()) {
        // Es un Administrador, permite el acceso
        return true;
      }

      // Verifica si el usuario está en la colección de Pacientes
      const pacienteDocSnap = await getDoc(pacienteDocRef);
      if (pacienteDocSnap.exists()) {
        // Es un Paciente, permite el acceso
        return true;
      }

      // Verifica si el usuario está en la colección de Especialistas
      const especialistaDocSnap = await getDoc(especialistaDocRef);
      if (
        especialistaDocSnap.exists() &&
        especialistaDocSnap.data()['isHabilitado'] === true
      ) {
        // Es un Especialista y está habilitado, permite el acceso
        return true;
      } else if (especialistaDocSnap.exists()) {
        // Es un Especialista, pero no está habilitado
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Su cuenta aún no fue habilitada por un administrador',
          position: 'top',
          toast: true,
          showConfirmButton: true,
          background: '#f8d7da',
          customClass: {
            popup: 'my-custom-popup',
          },
        });
        this.router.navigate(['/login']);
        return false;
      }

      // Si no se encontró en ninguna colección, redirige al login
      this.router.navigate(['/login']);
      return false;
    } else {
      // Si no está autenticado, redirige al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
