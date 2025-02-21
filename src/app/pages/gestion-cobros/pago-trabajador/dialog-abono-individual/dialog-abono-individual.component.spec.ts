import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAbonoIndividualComponent } from './dialog-abono-individual.component';

describe('DialogAbonoIndividualComponent', () => {
  let component: DialogAbonoIndividualComponent;
  let fixture: ComponentFixture<DialogAbonoIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAbonoIndividualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAbonoIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
