import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantidadTurnosEspecialidadComponent } from './cantidad-turnos-especialidad.component';

describe('CantidadTurnosEspecialidadComponent', () => {
  let component: CantidadTurnosEspecialidadComponent;
  let fixture: ComponentFixture<CantidadTurnosEspecialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CantidadTurnosEspecialidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CantidadTurnosEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
