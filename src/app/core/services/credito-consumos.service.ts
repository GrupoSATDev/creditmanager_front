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

}
