import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePrestamoHistoricoComponent } from './reporte-prestamo-historico.component';

describe('ReportePrestamoHistoricoComponent', () => {
  let component: ReportePrestamoHistoricoComponent;
  let fixture: ComponentFixture<ReportePrestamoHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportePrestamoHistoricoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportePrestamoHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
