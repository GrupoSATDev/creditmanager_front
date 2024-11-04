import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSubscripcionComponent } from './grid-subscripcion.component';

describe('GridSubscripcionComponent', () => {
  let component: GridSubscripcionComponent;
  let fixture: ComponentFixture<GridSubscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridSubscripcionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridSubscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
