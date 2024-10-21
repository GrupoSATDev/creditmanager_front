import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoAliadosService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  getAliados(): Observable<any> {
      return this._http.get(`${this.appSettings.pagoAliados.url.base}/Tabla`)
  }

}
