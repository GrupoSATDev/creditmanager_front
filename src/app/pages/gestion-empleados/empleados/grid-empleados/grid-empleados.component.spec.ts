import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridEmpleadosComponent } from './grid-empleados.component';

describe('GridEmpleadosComponent', () => {
  let component: GridEmpleadosComponent;
  let fixture: ComponentFixture<GridEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridEmpleadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
