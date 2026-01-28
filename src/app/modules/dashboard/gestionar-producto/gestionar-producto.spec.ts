import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarProducto } from './gestionar-producto';

describe('GestionarProducto', () => {
  let component: GestionarProducto;
  let fixture: ComponentFixture<GestionarProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionarProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarProducto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
