import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDesembolsosGeneralComponent } from './reporte-desembolsos-general.component';

describe('ReporteDesembolsosGeneralComponent', () => {
  let component: ReporteDesembolsosGeneralComponent;
  let fixture: ComponentFixture<ReporteDesembolsosGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDesembolsosGeneralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteDesembolsosGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
