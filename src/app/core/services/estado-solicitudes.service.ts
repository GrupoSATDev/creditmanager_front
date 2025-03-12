import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoSolicitudesService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  public getEstados(): Observable<any> {
      return this._http.get(this.appSettings.estadoSolicitudes.url.base)
  }
}
