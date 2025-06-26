import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreditoConsumosComponent } from './dialog-credito-consumos.component';

describe('DialogCreditoConsumosComponent', () => {
  let component: DialogCreditoConsumosComponent;
  let fixture: ComponentFixture<DialogCreditoConsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCreditoConsumosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogCreditoConsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
