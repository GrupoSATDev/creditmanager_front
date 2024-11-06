import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDesembolsosComponent } from './main-desembolsos.component';

describe('MainDesembolsosComponent', () => {
  let component: MainDesembolsosComponent;
  let fixture: ComponentFixture<MainDesembolsosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainDesembolsosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainDesembolsosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
