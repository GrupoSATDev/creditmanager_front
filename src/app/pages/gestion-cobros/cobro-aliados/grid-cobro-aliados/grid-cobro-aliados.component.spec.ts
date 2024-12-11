import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCobroAliadosComponent } from './grid-cobro-aliados.component';

describe('GridCobroAliadosComponent', () => {
  let component: GridCobroAliadosComponent;
  let fixture: ComponentFixture<GridCobroAliadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridCobroAliadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridCobroAliadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
