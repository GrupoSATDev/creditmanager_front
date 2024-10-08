import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmDesembolsoComponent } from './dialog-confirm-desembolso.component';

describe('DialogConfirmDesembolsoComponent', () => {
  let component: DialogConfirmDesembolsoComponent;
  let fixture: ComponentFixture<DialogConfirmDesembolsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogConfirmDesembolsoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogConfirmDesembolsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
