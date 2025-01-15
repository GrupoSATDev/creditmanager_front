import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRentabilidadInteresesComponent } from './dashboard-rentabilidad-intereses.component';

describe('DashboardRentabilidadInteresesComponent', () => {
  let component: DashboardRentabilidadInteresesComponent;
  let fixture: ComponentFixture<DashboardRentabilidadInteresesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRentabilidadInteresesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardRentabilidadInteresesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
