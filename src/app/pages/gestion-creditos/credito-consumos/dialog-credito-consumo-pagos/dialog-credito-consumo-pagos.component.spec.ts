import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreditoConsumoPagosComponent } from './dialog-credito-consumo-pagos.component';

describe('DialogCreditoConsumoPagosComponent', () => {
  let component: DialogCreditoConsumoPagosComponent;
  let fixture: ComponentFixture<DialogCreditoConsumoPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCreditoConsumoPagosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogCreditoConsumoPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
