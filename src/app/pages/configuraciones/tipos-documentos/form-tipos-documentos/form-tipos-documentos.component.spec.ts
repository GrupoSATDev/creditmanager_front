import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTiposDocumentosComponent } from './form-tipos-documentos.component';

describe('FormTiposDocumentosComponent', () => {
  let component: FormTiposDocumentosComponent;
  let fixture: ComponentFixture<FormTiposDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTiposDocumentosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormTiposDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
