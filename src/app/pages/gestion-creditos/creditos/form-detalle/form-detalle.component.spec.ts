import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDetalleComponent } from './form-detalle.component';

describe('FormDetalleComponent', () => {
  let component: FormDetalleComponent;
  let fixture: ComponentFixture<FormDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDetalleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
