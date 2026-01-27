import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesactivarUsuario } from './desactivar-usuario';

describe('DesactivarUsuario', () => {
  let component: DesactivarUsuario;
  let fixture: ComponentFixture<DesactivarUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesactivarUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesactivarUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
