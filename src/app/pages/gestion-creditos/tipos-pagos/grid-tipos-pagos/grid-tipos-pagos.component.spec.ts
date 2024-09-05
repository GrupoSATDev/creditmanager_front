import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTiposPagosComponent } from './grid-tipos-pagos.component';

describe('GridTiposPagosComponent', () => {
  let component: GridTiposPagosComponent;
  let fixture: ComponentFixture<GridTiposPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridTiposPagosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridTiposPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
