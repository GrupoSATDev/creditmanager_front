import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPagoTrabajadorComponent } from './form-pago-trabajador.component';

describe('FormPagoTrabajadorComponent', () => {
  let component: FormPagoTrabajadorComponent;
  let fixture: ComponentFixture<FormPagoTrabajadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPagoTrabajadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormPagoTrabajadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
