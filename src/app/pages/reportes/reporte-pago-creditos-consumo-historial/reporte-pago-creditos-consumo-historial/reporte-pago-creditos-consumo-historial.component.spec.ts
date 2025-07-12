import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePagoCreditosConsumoHistorialComponent } from './reporte-pago-creditos-consumo-historial.component';

describe('ReportePagoCreditosConsumoHistorialComponent', () => {
  let component: ReportePagoCreditosConsumoHistorialComponent;
  let fixture: ComponentFixture<ReportePagoCreditosConsumoHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportePagoCreditosConsumoHistorialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportePagoCreditosConsumoHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
