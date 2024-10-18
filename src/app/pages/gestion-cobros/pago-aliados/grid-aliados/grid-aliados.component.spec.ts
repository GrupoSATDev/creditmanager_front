import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridAliadosComponent } from './grid-aliados.component';

describe('GridAliadosComponent', () => {
  let component: GridAliadosComponent;
  let fixture: ComponentFixture<GridAliadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridAliadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridAliadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
