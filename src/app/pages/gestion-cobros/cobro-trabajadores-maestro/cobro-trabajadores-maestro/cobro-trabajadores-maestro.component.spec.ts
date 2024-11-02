import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CobroTrabajadoresMaestroComponent } from './cobro-trabajadores-maestro.component';

describe('CobroTrabajadoresMaestroComponent', () => {
  let component: CobroTrabajadoresMaestroComponent;
  let fixture: ComponentFixture<CobroTrabajadoresMaestroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CobroTrabajadoresMaestroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CobroTrabajadoresMaestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
