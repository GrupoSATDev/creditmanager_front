import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSubscripcionesComponent } from './main-subscripciones.component';

describe('MainSubscripcionesComponent', () => {
  let component: MainSubscripcionesComponent;
  let fixture: ComponentFixture<MainSubscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainSubscripcionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainSubscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
