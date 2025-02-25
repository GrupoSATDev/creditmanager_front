import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCobroTrabajadoresComponent } from './reporte-cobro-trabajadores.component';

describe('ReporteCobroTrabajadoresComponent', () => {
  let component: ReporteCobroTrabajadoresComponent;
  let fixture: ComponentFixture<ReporteCobroTrabajadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteCobroTrabajadoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteCobroTrabajadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
