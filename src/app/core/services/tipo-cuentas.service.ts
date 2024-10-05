import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoCuentasService {

    constructor(
        private _http: HttpClient,
        private appSettings: AppSettingsService
    ) { }

    getTipoCuentas(): Observable<any> {
        return this._http.get(this.appSettings.tipoCuentas.url.base)
    }

    getTipoCuenta(id): Observable<any> {
        return this._http.get(`${this.appSettings.tipoCuentas.url.base}/${id}`)
    }
}
