import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTiposPagosComponent } from './form-tipos-pagos.component';

describe('FormTiposPagosComponent', () => {
  let component: FormTiposPagosComponent;
  let fixture: ComponentFixture<FormTiposPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTiposPagosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormTiposPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
