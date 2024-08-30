import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCapitalInversionComponent } from './form-capital-inversion.component';

describe('FormCapitalInversionComponent', () => {
  let component: FormCapitalInversionComponent;
  let fixture: ComponentFixture<FormCapitalInversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCapitalInversionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCapitalInversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
