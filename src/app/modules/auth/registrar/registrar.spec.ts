import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarComponent } from './registrar';

describe('Registrar', () => {
  let component: RegistrarComponent;
  let fixture: ComponentFixture<RegistrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
