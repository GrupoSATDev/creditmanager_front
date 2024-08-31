import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridGenerosComponent } from './grid-generos.component';

describe('GridGenerosComponent', () => {
  let component: GridGenerosComponent;
  let fixture: ComponentFixture<GridGenerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridGenerosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridGenerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
