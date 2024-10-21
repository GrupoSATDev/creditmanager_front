import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAliadosComponent } from './form-aliados.component';

describe('FormAliadosComponent', () => {
  let component: FormAliadosComponent;
  let fixture: ComponentFixture<FormAliadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAliadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormAliadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
