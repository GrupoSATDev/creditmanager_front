import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQrComponent } from './form-qr.component';

describe('FormQrComponent', () => {
  let component: FormQrComponent;
  let fixture: ComponentFixture<FormQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormQrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
