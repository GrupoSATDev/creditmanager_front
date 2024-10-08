import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTasasComponent } from './grid-tasas.component';

describe('GridTasasComponent', () => {
  let component: GridTasasComponent;
  let fixture: ComponentFixture<GridTasasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridTasasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridTasasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
