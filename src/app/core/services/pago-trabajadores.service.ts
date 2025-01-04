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

    getPagosTrabajadores(params): Observable<any> {
        return this._http.get(`${this.appSettings.pagoTrabajadores.url.base}/Tabla?IdEstadoCobroPago=${params}`)
    }

    getPagoTrabajadorIndividual(params): Observable<any> {
        return this._http.get(`${this.appSettings.pagoTrabajadores.url.base}/TablaIndividual?IdEstadoCobroPago=${params}`)
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

    putPagoTrabajadorIndividual(data): Observable<any> {
        const id = data.id;
        delete data.id;
        return this._http.put(`${this.appSettings.pagoTrabajadores.url.base}/${id}`, data)
    }


}
