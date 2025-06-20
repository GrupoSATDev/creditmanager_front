import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteRecuperaInversionComponent } from './reporte-recupera-inversion.component';

describe('ReporteRecuperaInversionComponent', () => {
  let component: ReporteRecuperaInversionComponent;
  let fixture: ComponentFixture<ReporteRecuperaInversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteRecuperaInversionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteRecuperaInversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
