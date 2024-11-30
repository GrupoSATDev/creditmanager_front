import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormViewDesembolsoComponent } from './form-view-desembolso.component';

describe('FormViewDesembolsoComponent', () => {
  let component: FormViewDesembolsoComponent;
  let fixture: ComponentFixture<FormViewDesembolsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormViewDesembolsoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormViewDesembolsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
