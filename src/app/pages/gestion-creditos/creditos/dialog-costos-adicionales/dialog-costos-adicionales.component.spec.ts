import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCostosAdicionalesComponent } from './dialog-costos-adicionales.component';

describe('DialogCostosAdicionalesComponent', () => {
  let component: DialogCostosAdicionalesComponent;
  let fixture: ComponentFixture<DialogCostosAdicionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCostosAdicionalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogCostosAdicionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
