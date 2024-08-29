import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadosDatosService {
  public stateGrid: Subject<boolean> = new Subject<boolean>();
  constructor() { }
}
