import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCapitalInversionComponent } from './grid-capital-inversion.component';

describe('GridCapitalInversionComponent', () => {
  let component: GridCapitalInversionComponent;
  let fixture: ComponentFixture<GridCapitalInversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridCapitalInversionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridCapitalInversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
