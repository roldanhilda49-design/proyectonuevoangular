import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienvenidaAdmin } from './bienvenida-admin';

describe('BienvenidaAdmin', () => {
  let component: BienvenidaAdmin;
  let fixture: ComponentFixture<BienvenidaAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BienvenidaAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BienvenidaAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
