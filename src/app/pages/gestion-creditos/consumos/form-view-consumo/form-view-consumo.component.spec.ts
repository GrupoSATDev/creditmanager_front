import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormViewConsumoComponent } from './form-view-consumo.component';

describe('FormViewConsumoComponent', () => {
  let component: FormViewConsumoComponent;
  let fixture: ComponentFixture<FormViewConsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormViewConsumoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormViewConsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
