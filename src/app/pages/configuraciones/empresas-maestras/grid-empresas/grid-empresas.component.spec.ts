import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridEmpresasComponent } from './grid-empresas.component';

describe('GridEmpresasComponent', () => {
  let component: GridEmpresasComponent;
  let fixture: ComponentFixture<GridEmpresasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridEmpresasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
