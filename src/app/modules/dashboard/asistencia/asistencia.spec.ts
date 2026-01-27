import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaComponent } from './asistencia';

describe('Asistencia', () => {
  let component: AsistenciaComponent;
  let fixture: ComponentFixture<AsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsistenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistenciaComponent );
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
