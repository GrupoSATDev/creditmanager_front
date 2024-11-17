import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridUsuariosEmpresasComponent } from './grid-usuarios-empresas.component';

describe('GridUsuariosEmpresasComponent', () => {
  let component: GridUsuariosEmpresasComponent;
  let fixture: ComponentFixture<GridUsuariosEmpresasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridUsuariosEmpresasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridUsuariosEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
