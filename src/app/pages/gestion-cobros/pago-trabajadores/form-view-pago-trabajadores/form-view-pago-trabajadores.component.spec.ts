import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormViewPagoTrabajadoresComponent } from './form-view-pago-trabajadores.component';

describe('FormViewPagoTrabajadoresComponent', () => {
  let component: FormViewPagoTrabajadoresComponent;
  let fixture: ComponentFixture<FormViewPagoTrabajadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormViewPagoTrabajadoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormViewPagoTrabajadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
