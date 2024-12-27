import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormViewDetalleRechazadoComponent } from './form-view-detalle-rechazado.component';

describe('FormViewDetalleRechazadoComponent', () => {
  let component: FormViewDetalleRechazadoComponent;
  let fixture: ComponentFixture<FormViewDetalleRechazadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormViewDetalleRechazadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormViewDetalleRechazadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
