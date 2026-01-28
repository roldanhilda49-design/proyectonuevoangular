import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoLista } from './carrito-lista';

describe('CarritoLista', () => {
  let component: CarritoLista;
  let fixture: ComponentFixture<CarritoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarritoLista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
