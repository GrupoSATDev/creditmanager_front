import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCobroFijoComponent } from './grid-cobro-fijo.component';

describe('GridCobroFijoComponent', () => {
  let component: GridCobroFijoComponent;
  let fixture: ComponentFixture<GridCobroFijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridCobroFijoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridCobroFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
