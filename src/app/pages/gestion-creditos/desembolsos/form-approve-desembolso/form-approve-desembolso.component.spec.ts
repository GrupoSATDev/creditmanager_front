import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormApproveDesembolsoComponent } from './form-approve-desembolso.component';

describe('FormApproveDesembolsoComponent', () => {
  let component: FormApproveDesembolsoComponent;
  let fixture: ComponentFixture<FormApproveDesembolsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormApproveDesembolsoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormApproveDesembolsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
