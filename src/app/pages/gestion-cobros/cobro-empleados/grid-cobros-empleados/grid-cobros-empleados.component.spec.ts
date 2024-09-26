import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCobrosEmpleadosComponent } from './grid-cobros-empleados.component';

describe('GridCobrosEmpleadosComponent', () => {
  let component: GridCobrosEmpleadosComponent;
  let fixture: ComponentFixture<GridCobrosEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridCobrosEmpleadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridCobrosEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
