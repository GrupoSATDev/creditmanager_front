import { TestBed } from '@angular/core/testing';

import { CreditoConsumosService } from './credito-consumos.service';

describe('CreditoConsumosService', () => {
  let service: CreditoConsumosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditoConsumosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
