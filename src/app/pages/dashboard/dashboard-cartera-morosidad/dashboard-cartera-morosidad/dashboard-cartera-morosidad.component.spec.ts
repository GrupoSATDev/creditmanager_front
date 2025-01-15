import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCarteraMorosidadComponent } from './dashboard-cartera-morosidad.component';

describe('DashboardCarteraMorosidadComponent', () => {
  let component: DashboardCarteraMorosidadComponent;
  let fixture: ComponentFixture<DashboardCarteraMorosidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCarteraMorosidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardCarteraMorosidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
