import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridPagoTrabajadoresComponent } from './grid-pago-trabajadores.component';

describe('GridPagoTrabajadoresComponent', () => {
  let component: GridPagoTrabajadoresComponent;
  let fixture: ComponentFixture<GridPagoTrabajadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridPagoTrabajadoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridPagoTrabajadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
