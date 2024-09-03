import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSolicitudesComponent } from './grid-solicitudes.component';

describe('GridSolicitudesComponent', () => {
  let component: GridSolicitudesComponent;
  let fixture: ComponentFixture<GridSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridSolicitudesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
