import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAbonosMasivosComponent } from './dialog-abonos-masivos.component';

describe('DialogAbonosMasivosComponent', () => {
  let component: DialogAbonosMasivosComponent;
  let fixture: ComponentFixture<DialogAbonosMasivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAbonosMasivosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAbonosMasivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
