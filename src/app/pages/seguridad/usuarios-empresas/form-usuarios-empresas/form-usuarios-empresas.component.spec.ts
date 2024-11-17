import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUsuariosEmpresasComponent } from './form-usuarios-empresas.component';

describe('FormUsuariosEmpresasComponent', () => {
  let component: FormUsuariosEmpresasComponent;
  let fixture: ComponentFixture<FormUsuariosEmpresasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormUsuariosEmpresasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormUsuariosEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
