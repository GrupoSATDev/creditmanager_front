import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSubscripcionesComponent } from './form-subscripciones.component';

describe('FormSubscripcionesComponent', () => {
  let component: FormSubscripcionesComponent;
  let fixture: ComponentFixture<FormSubscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSubscripcionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormSubscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
