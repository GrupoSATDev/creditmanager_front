import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConsumosComponent } from './form-consumos.component';

describe('FormConsumosComponent', () => {
  let component: FormConsumosComponent;
  let fixture: ComponentFixture<FormConsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormConsumosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormConsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
