import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienvenidaCliente } from './bienvenida-cliente';

describe('BienvenidaCliente', () => {
  let component: BienvenidaCliente;
  let fixture: ComponentFixture<BienvenidaCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BienvenidaCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BienvenidaCliente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
