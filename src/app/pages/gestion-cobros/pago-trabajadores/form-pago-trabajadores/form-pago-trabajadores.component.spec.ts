import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPagoTrabajadoresComponent } from './form-pago-trabajadores.component';

describe('FormPagoTrabajadoresComponent', () => {
  let component: FormPagoTrabajadoresComponent;
  let fixture: ComponentFixture<FormPagoTrabajadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPagoTrabajadoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormPagoTrabajadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
