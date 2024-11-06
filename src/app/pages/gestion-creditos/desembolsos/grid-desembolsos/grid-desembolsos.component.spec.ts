import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridDesembolsosComponent } from './grid-desembolsos.component';

describe('GridDesembolsosComponent', () => {
  let component: GridDesembolsosComponent;
  let fixture: ComponentFixture<GridDesembolsosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridDesembolsosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridDesembolsosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
