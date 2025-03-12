import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteSolicitudesComponent } from './reporte-solicitudes.component';

describe('ReporteSolicitudesComponent', () => {
  let component: ReporteSolicitudesComponent;
  let fixture: ComponentFixture<ReporteSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteSolicitudesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
