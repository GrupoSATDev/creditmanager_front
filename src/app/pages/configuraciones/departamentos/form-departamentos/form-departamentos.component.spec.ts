import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDepartamentosComponent } from './form-departamentos.component';

describe('FormDepartamentosComponent', () => {
  let component: FormDepartamentosComponent;
  let fixture: ComponentFixture<FormDepartamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDepartamentosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormDepartamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
