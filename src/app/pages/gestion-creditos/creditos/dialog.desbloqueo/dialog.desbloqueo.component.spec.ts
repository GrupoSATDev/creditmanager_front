import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDesbloqueoComponent } from './dialog.desbloqueo.component';

describe('DialogDesbloqueoComponent', () => {
  let component: DialogDesbloqueoComponent;
  let fixture: ComponentFixture<DialogDesbloqueoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDesbloqueoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDesbloqueoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
