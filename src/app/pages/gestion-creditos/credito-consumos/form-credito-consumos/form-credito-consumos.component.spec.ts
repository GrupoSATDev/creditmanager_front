import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreditoConsumosComponent } from './form-credito-consumos.component';

describe('FormCreditoConsumosComponent', () => {
  let component: FormCreditoConsumosComponent;
  let fixture: ComponentFixture<FormCreditoConsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCreditoConsumosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCreditoConsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
