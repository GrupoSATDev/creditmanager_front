import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTasasComponent } from './form-tasas.component';

describe('FormTasasComponent', () => {
  let component: FormTasasComponent;
  let fixture: ComponentFixture<FormTasasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTasasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormTasasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
