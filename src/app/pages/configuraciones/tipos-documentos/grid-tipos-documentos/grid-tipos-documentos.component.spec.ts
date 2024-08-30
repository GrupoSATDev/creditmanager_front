import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTiposDocumentosComponent } from './grid-tipos-documentos.component';

describe('GridTiposDocumentosComponent', () => {
  let component: GridTiposDocumentosComponent;
  let fixture: ComponentFixture<GridTiposDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridTiposDocumentosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridTiposDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
