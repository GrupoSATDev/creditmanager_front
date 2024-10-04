import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesembolsoComponent } from './form-desembolso.component';

describe('FormDesembolsoComponent', () => {
  let component: FormDesembolsoComponent;
  let fixture: ComponentFixture<FormDesembolsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDesembolsoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormDesembolsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
