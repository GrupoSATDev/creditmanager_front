import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCobroAliadoComponent } from './dialog-cobro-aliado.component';

describe('DialogCobroAliadoComponent', () => {
  let component: DialogCobroAliadoComponent;
  let fixture: ComponentFixture<DialogCobroAliadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCobroAliadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogCobroAliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
