import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreditosConsumoEstadosComponent } from './dialog-creditos-consumo-estados.component';

describe('DialogCreditosConsumoEstadosComponent', () => {
  let component: DialogCreditosConsumoEstadosComponent;
  let fixture: ComponentFixture<DialogCreditosConsumoEstadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCreditosConsumoEstadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogCreditosConsumoEstadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
