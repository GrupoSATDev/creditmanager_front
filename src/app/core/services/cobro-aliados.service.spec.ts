import { TestBed } from '@angular/core/testing';

import { CobroAliadosService } from './cobro-aliados.service';

describe('CobroAliadosService', () => {
  let service: CobroAliadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CobroAliadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
