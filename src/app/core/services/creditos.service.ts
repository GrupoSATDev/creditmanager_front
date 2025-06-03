import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditosService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

    getCreditos(param): Observable<any> {
        return this._http.get(`${this.appSettings.creditos.url.base}/Estado/${param}`)
    }

    getCreditosSinCobrosFijos(): Observable<any> {
        return this._http.get(`${this.appSettings.creditos.url.base}/SinCobrosFijos`)
    }
    getCreditosSinCobrosFijosAumentos(): Observable<any> {
        return this._http.get(`${this.appSettings.creditos.url.base}/AumentosSinCobrosFijos`)
    }

    getCredito(id): Observable<any> {
        return this._http.get(`${this.appSettings.creditos.url.base}/${id}`)
    }

    putCredito(data): Observable<any> {
      const id = data.id;
      delete data.id;
      return this._http.put(`${this.appSettings.creditos.url.base}/${id}`, data)
    }

    putCreditoEdit(data): Observable<any> {
      const id = data.id;
      delete data.id;
      return this._http.put(`${this.appSettings.creditos.url.base}/parcial/${id}`, data)
    }

    patchRechazado(data): Observable<any> {
      const id = data.id;
      return this._http.patch(`${this.appSettings.creditos.url.base}/${id}?id=${data.id}&idEstado=${data.idEstado}`, {})
    }
}
