import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridConsumosComponent } from './grid-consumos.component';

describe('GridConsumosComponent', () => {
  let component: GridConsumosComponent;
  let fixture: ComponentFixture<GridConsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridConsumosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridConsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
