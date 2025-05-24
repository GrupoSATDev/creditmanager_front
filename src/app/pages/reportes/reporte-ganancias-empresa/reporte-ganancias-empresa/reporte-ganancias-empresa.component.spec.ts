import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteGananciasEmpresaComponent } from './reporte-ganancias-empresa.component';

describe('ReporteGananciasEmpresaComponent', () => {
  let component: ReporteGananciasEmpresaComponent;
  let fixture: ComponentFixture<ReporteGananciasEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteGananciasEmpresaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteGananciasEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
