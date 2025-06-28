import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBloqueosCreditosConsumoComponent } from './dialog-bloqueos-creditos-consumo.component';

describe('DialogBloqueosCreditosConsumoComponent', () => {
  let component: DialogBloqueosCreditosConsumoComponent;
  let fixture: ComponentFixture<DialogBloqueosCreditosConsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogBloqueosCreditosConsumoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogBloqueosCreditosConsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
