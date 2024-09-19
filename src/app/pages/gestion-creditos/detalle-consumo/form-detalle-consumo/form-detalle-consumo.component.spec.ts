import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDetalleConsumoComponent } from './form-detalle-consumo.component';

describe('FormDetalleConsumoComponent', () => {
  let component: FormDetalleConsumoComponent;
  let fixture: ComponentFixture<FormDetalleConsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDetalleConsumoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormDetalleConsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
