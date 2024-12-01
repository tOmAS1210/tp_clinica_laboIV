import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantidadTurnosFinalizadosPorMedicoComponent } from './cantidad-turnos-finalizados-por-medico.component';

describe('CantidadTurnosFinalizadosPorMedicoComponent', () => {
  let component: CantidadTurnosFinalizadosPorMedicoComponent;
  let fixture: ComponentFixture<CantidadTurnosFinalizadosPorMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CantidadTurnosFinalizadosPorMedicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CantidadTurnosFinalizadosPorMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
