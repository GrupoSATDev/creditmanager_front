import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCreditoConsumosComponent } from './grid-credito-consumos.component';

describe('GridCreditoConsumosComponent', () => {
  let component: GridCreditoConsumosComponent;
  let fixture: ComponentFixture<GridCreditoConsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridCreditoConsumosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridCreditoConsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
