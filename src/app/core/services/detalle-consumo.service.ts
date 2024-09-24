import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetalleConsumoService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  getDetalle(param): Observable<any> {
      return this._http.get(`${this.appSettings.detalleConsumos.url.base}/${param}`);
  }

  postDetalle(data) : Observable<any> {
      return this._http.post(this.appSettings.detalleConsumos.url.base, data);
  }

  getResumen(id): Observable<any> {
      return this._http.get(`${this.appSettings.detalleConsumos.url.base}/trabajador/${id}`)
  }
}
