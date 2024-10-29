import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridBancosComponent } from './grid-bancos.component';

describe('GridBancosComponent', () => {
  let component: GridBancosComponent;
  let fixture: ComponentFixture<GridBancosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridBancosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridBancosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
