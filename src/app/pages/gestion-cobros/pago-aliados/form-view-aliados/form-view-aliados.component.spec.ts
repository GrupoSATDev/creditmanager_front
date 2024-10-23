import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormViewAliadosComponent } from './form-view-aliados.component';

describe('FormViewAliadosComponent', () => {
  let component: FormViewAliadosComponent;
  let fixture: ComponentFixture<FormViewAliadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormViewAliadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormViewAliadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
