import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridDepartamentosComponent } from './grid-departamentos.component';

describe('GridDepartamentosComponent', () => {
  let component: GridDepartamentosComponent;
  let fixture: ComponentFixture<GridDepartamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridDepartamentosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridDepartamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
