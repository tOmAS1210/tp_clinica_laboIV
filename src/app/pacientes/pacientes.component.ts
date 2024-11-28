import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css',
})
export class PacientesComponent implements OnInit {
  pacientes: any[] = [];
  historialesClinicos: any[] = [];
  allPacientes: any[] = [];

  constructor(private userService: UserService) {}

  async ngOnInit() {
    this.allPacientes = await this.userService.getPacientes();
    this.pacientes = [];

    for (const paciente of this.allPacientes) {
      const historiales = await this.userService.obtenerHistorialClinico(
        paciente.uid
      );

      if (historiales && historiales.length > 0) {
        this.pacientes.push(paciente); // Solo agregar si tiene historiales
        historiales.forEach((historial: any) => {
          this.historialesClinicos.push({
            pacienteUid: paciente.uid,
            historial,
          });
        });
      }
    }
  }

  tieneHistorial(pacienteUid: string): boolean {
    return this.historialesClinicos.some(
      (historia) => historia.pacienteUid === pacienteUid
    );
  }

  obtenerHistorialesDelPaciente(uid: string): any[] {
    return this.historialesClinicos.filter(
      (historia) => historia.pacienteUid === uid
    );
  }
}
