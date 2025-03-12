import { TestBed } from '@angular/core/testing';

import { EstadoSolicitudesService } from './estado-solicitudes.service';

describe('EstadoSolicitudesService', () => {
  let service: EstadoSolicitudesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoSolicitudesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
