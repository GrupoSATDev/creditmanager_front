import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CobroAliadoFacturaComponent } from './cobro-aliado-factura.component';

describe('CobroAliadoFacturaComponent', () => {
  let component: CobroAliadoFacturaComponent;
  let fixture: ComponentFixture<CobroAliadoFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CobroAliadoFacturaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CobroAliadoFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
