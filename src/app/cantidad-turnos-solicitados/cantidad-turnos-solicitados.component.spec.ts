import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantidadTurnosSolicitadosComponent } from './cantidad-turnos-solicitados.component';

describe('CantidadTurnosSolicitadosComponent', () => {
  let component: CantidadTurnosSolicitadosComponent;
  let fixture: ComponentFixture<CantidadTurnosSolicitadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CantidadTurnosSolicitadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CantidadTurnosSolicitadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
