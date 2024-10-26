import { TestBed } from '@angular/core/testing';

import { PagoTrabajadoresService } from './pago-trabajadores.service';

describe('PagoTrabajadoresService', () => {
  let service: PagoTrabajadoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagoTrabajadoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
