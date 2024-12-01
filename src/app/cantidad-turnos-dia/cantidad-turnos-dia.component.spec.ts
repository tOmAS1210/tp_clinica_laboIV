import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantidadTurnosDiaComponent } from './cantidad-turnos-dia.component';

describe('CantidadTurnosDiaComponent', () => {
  let component: CantidadTurnosDiaComponent;
  let fixture: ComponentFixture<CantidadTurnosDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CantidadTurnosDiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CantidadTurnosDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
