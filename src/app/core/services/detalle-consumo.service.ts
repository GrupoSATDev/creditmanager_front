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

  getConsumo(id): Observable<any> {
      return this._http.get(`${this.appSettings.detalleConsumos.url.base}/${id}`);
  }

  postDetalle(data) : Observable<any> {
      return this._http.post(this.appSettings.detalleConsumos.url.base, data);
  }
 postDesembolso(data) : Observable<any> {
      return this._http.post(this.appSettings.detalleConsumos.url.base, data);
  }

  getResumen(id): Observable<any> {
      return this._http.get(`${this.appSettings.detalleConsumos.url.base}/trabajador/${id}`)
  }

  patchConsumo(data): Observable<any> {
    const id = data.id;
    delete data.id;
    const {idEstado} = data;
    return this._http.patch(`${this.appSettings.detalleConsumos.url.base}/${id}?idEstado=${idEstado}`,{} )
  }
}
