import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoTrabajadoresService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

    getPagosTrabajadores(): Observable<any> {
        return this._http.get(`${this.appSettings.pagoTrabajadores.url.base}/Tabla`)
    }

    getPagoTrabajadorIndividual(): Observable<any> {
        return this._http.get(`${this.appSettings.pagoTrabajadores.url.base}/TablaIndividual`)
    }
    postPagosTrabajadores(data): Observable<any> {
        return this._http.post(this.appSettings.pagoTrabajadores.url.base, data)
    }

    postPagoTrabajador(data): Observable<any> {
        return this._http.post(`${this.appSettings.pagoTrabajadores.url.base}/Individual`, data)
    }

    getPagosTrabajador(id): Observable<any> {
        return this._http.get(`${this.appSettings.pagoTrabajadores.url.base}/${id}`)
    }

    getPagosTrabajadorIndividual(id): Observable<any> {
        return this._http.get(`${this.appSettings.pagoTrabajadores.url.base}/individual/${id}`)
    }

    tipoPagoTrabajadores(): Observable<any> {
      return this._http.get(this.appSettings.pagoTrabajadores.url.baseTipo)
    }


}
