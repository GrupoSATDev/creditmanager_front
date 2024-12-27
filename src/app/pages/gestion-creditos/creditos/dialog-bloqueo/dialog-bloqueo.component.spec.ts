import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBloqueoComponent } from './dialog-bloqueo.component';

describe('DialogBloqueoComponent', () => {
  let component: DialogBloqueoComponent;
  let fixture: ComponentFixture<DialogBloqueoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogBloqueoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogBloqueoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
