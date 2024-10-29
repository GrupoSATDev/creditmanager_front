import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormViewPagoTrabajadorComponent } from './form-view-pago-trabajador.component';

describe('FormViewPagoTrabajadorComponent', () => {
  let component: FormViewPagoTrabajadorComponent;
  let fixture: ComponentFixture<FormViewPagoTrabajadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormViewPagoTrabajadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormViewPagoTrabajadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
