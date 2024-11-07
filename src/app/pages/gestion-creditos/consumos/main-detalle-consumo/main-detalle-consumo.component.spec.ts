import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDetalleConsumoComponent } from './main-detalle-consumo.component';

describe('MainDetalleConsumoComponent', () => {
  let component: MainDetalleConsumoComponent;
  let fixture: ComponentFixture<MainDetalleConsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainDetalleConsumoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainDetalleConsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
