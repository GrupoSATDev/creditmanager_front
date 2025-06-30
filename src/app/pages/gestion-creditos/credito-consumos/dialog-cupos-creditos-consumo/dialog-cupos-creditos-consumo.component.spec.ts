import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCuposCreditosConsumoComponent } from './dialog-cupos-creditos-consumo.component';

describe('DialogCuposCreditosConsumoComponent', () => {
  let component: DialogCuposCreditosConsumoComponent;
  let fixture: ComponentFixture<DialogCuposCreditosConsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCuposCreditosConsumoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogCuposCreditosConsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
