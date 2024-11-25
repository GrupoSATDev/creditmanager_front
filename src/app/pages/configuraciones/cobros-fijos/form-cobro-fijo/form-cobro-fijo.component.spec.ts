import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCobroFijoComponent } from './form-cobro-fijo.component';

describe('FormCobroFijoComponent', () => {
  let component: FormCobroFijoComponent;
  let fixture: ComponentFixture<FormCobroFijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCobroFijoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCobroFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
