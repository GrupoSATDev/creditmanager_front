import { TestBed } from '@angular/core/testing';

import { CobrosFijosService } from './cobros-fijos.service';

describe('CobrosFijosService', () => {
  let service: CobrosFijosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CobrosFijosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
