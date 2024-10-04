import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCuentasComponent } from './form-cuentas.component';

describe('FormCuentasComponent', () => {
  let component: FormCuentasComponent;
  let fixture: ComponentFixture<FormCuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCuentasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
