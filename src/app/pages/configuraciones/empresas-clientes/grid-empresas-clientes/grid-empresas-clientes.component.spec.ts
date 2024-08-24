import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridEmpresasClientesComponent } from './grid-empresas-clientes.component';

describe('GridEmpresasClientesComponent', () => {
  let component: GridEmpresasClientesComponent;
  let fixture: ComponentFixture<GridEmpresasClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridEmpresasClientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridEmpresasClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
