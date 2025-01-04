import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEstadoMasivoComponent } from './dialog-estado-masivo.component';

describe('DialogEstadoMasivoComponent', () => {
  let component: DialogEstadoMasivoComponent;
  let fixture: ComponentFixture<DialogEstadoMasivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEstadoMasivoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogEstadoMasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
