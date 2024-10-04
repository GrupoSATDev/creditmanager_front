import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCuentasComponent } from './grid-cuentas.component';

describe('GridCuentasComponent', () => {
  let component: GridCuentasComponent;
  let fixture: ComponentFixture<GridCuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridCuentasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
