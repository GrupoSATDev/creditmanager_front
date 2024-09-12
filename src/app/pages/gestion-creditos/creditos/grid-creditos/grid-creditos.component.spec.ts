import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCreditosComponent } from './grid-creditos.component';

describe('GridCreditosComponent', () => {
  let component: GridCreditosComponent;
  let fixture: ComponentFixture<GridCreditosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridCreditosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridCreditosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
