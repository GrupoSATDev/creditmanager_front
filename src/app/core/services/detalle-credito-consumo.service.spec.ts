import { TestBed } from '@angular/core/testing';

import { DetalleCreditoConsumoService } from './detalle-credito-consumo.service';

describe('DetalleCreditoConsumoService', () => {
  let service: DetalleCreditoConsumoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleCreditoConsumoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
