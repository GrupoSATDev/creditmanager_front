import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenrenewaldialogComponent } from './tokenrenewaldialog.component';

describe('TokenrenewaldialogComponent', () => {
  let component: TokenrenewaldialogComponent;
  let fixture: ComponentFixture<TokenrenewaldialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenrenewaldialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TokenrenewaldialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
