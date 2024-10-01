import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmSolicitudComponent } from './dialog-confirm-solicitud.component';

describe('DialogConfirmSolicitudComponent', () => {
  let component: DialogConfirmSolicitudComponent;
  let fixture: ComponentFixture<DialogConfirmSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogConfirmSolicitudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogConfirmSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
