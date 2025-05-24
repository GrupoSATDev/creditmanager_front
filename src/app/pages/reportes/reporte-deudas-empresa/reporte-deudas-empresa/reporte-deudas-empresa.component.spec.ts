import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDeudasEmpresaComponent } from './reporte-deudas-empresa.component';

describe('ReporteDeudasEmpresaComponent', () => {
  let component: ReporteDeudasEmpresaComponent;
  let fixture: ComponentFixture<ReporteDeudasEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDeudasEmpresaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteDeudasEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
