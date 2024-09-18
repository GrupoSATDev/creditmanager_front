import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormViewDetalleComponent } from './form-view-detalle.component';

describe('FormViewDetalleComponent', () => {
  let component: FormViewDetalleComponent;
  let fixture: ComponentFixture<FormViewDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormViewDetalleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormViewDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
