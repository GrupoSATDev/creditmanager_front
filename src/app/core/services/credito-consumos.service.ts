import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditoConsumosService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  getCreditoConsumos(): Observable<any> {
      return this._http.get(this.appSettings.creditoConsumo.url.base)
  }

  getCreditoConsumo(id: any): Observable<any> {
      return this._http.get(`${this.appSettings.creditoConsumo.url.base}/${id}`)
  }

  postCreditoConsumo(data: any): Observable<any> {
      return this._http.post(`${this.appSettings.creditoConsumo.url.base}`, data)
  }

  putCreditoConsumo(data: any): Observable<any> {
      const id = data.id;
      delete data.id;
      return this._http.put(`${this.appSettings.creditoConsumo.url.base}/${id}`, data)
  }

  patchCreditoConsumoEstado(id): Observable<any> {
      return this._http.patch(`${this.appSettings.creditoConsumo.url.base}/${id}/estado`, {})
  }

}
