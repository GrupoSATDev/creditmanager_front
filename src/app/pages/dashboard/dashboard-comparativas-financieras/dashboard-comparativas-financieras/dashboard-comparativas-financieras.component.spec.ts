import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComparativasFinancierasComponent } from './dashboard-comparativas-financieras.component';

describe('DashboardComparativasFinancierasComponent', () => {
  let component: DashboardComparativasFinancierasComponent;
  let fixture: ComponentFixture<DashboardComparativasFinancierasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComparativasFinancierasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardComparativasFinancierasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
