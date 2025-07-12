import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPendientesComponent } from './dashboard-pendientes.component';

describe('DashboardPendientesComponent', () => {
  let component: DashboardPendientesComponent;
  let fixture: ComponentFixture<DashboardPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPendientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
