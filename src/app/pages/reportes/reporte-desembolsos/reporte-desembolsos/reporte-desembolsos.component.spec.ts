import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDesembolsosComponent } from './reporte-desembolsos.component';

describe('ReporteDesembolsosComponent', () => {
  let component: ReporteDesembolsosComponent;
  let fixture: ComponentFixture<ReporteDesembolsosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDesembolsosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteDesembolsosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
