import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEmpresasClientesComponent } from './form-empresas-clientes.component';

describe('FormEmpresasClientesComponent', () => {
  let component: FormEmpresasClientesComponent;
  let fixture: ComponentFixture<FormEmpresasClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEmpresasClientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormEmpresasClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
