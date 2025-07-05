import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteConsumoDeudoresComponent } from './reporte-consumo-deudores.component';

describe('ReporteConsumoDeudoresComponent', () => {
  let component: ReporteConsumoDeudoresComponent;
  let fixture: ComponentFixture<ReporteConsumoDeudoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteConsumoDeudoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteConsumoDeudoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
