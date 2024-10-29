import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridPagoTrabajadorComponent } from './grid-pago-trabajador.component';

describe('GridPagoTrabajadorComponent', () => {
  let component: GridPagoTrabajadorComponent;
  let fixture: ComponentFixture<GridPagoTrabajadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridPagoTrabajadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridPagoTrabajadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
