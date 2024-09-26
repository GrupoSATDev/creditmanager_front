import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCobrosEmpleadosComponent } from './form-cobros-empleados.component';

describe('FormCobrosEmpleadosComponent', () => {
  let component: FormCobrosEmpleadosComponent;
  let fixture: ComponentFixture<FormCobrosEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCobrosEmpleadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCobrosEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
