import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormApproveComponent } from './form-approve.component';

describe('FormApproveComponent', () => {
  let component: FormApproveComponent;
  let fixture: ComponentFixture<FormApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormApproveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
