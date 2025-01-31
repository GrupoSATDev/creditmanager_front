import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDetalleEditComponent } from './form-detalle-edit.component';

describe('FormDetalleEditComponent', () => {
  let component: FormDetalleEditComponent;
  let fixture: ComponentFixture<FormDetalleEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDetalleEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormDetalleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
