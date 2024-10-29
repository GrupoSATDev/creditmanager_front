import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBancosComponent } from './form-bancos.component';

describe('FormBancosComponent', () => {
  let component: FormBancosComponent;
  let fixture: ComponentFixture<FormBancosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBancosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormBancosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
