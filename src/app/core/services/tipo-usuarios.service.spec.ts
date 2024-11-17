import { TestBed } from '@angular/core/testing';

import { TipoUsuariosService } from './tipo-usuarios.service';

describe('TipoUsuariosService', () => {
  let service: TipoUsuariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoUsuariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
