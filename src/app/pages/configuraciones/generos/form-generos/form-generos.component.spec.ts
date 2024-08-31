import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGenerosComponent } from './form-generos.component';

describe('FormGenerosComponent', () => {
  let component: FormGenerosComponent;
  let fixture: ComponentFixture<FormGenerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGenerosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormGenerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
