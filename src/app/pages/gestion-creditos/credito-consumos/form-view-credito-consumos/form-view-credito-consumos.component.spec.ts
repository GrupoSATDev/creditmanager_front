import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormViewCreditoConsumosComponent } from './form-view-credito-consumos.component';

describe('FormViewCreditoConsumosComponent', () => {
  let component: FormViewCreditoConsumosComponent;
  let fixture: ComponentFixture<FormViewCreditoConsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormViewCreditoConsumosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormViewCreditoConsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
