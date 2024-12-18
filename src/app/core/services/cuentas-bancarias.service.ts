import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentasBancariasService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

    getCuentas(): Observable<any> {
        return this._http.get(this.appSettings.cuentasBancarias.url.base);
    }

    getCuentasActivas(): Observable<any> {
        return this._http.get(`${this.appSettings.cuentasBancarias.url.base}/Select`);
    }

    getCuenta(id): Observable<any> {
        return this._http.get(`${this.appSettings.cuentasBancarias.url.base}/${id}`);
    }

    postCuentas(data): Observable<any> {
        delete data.id;
        return this._http.post(this.appSettings.cuentasBancarias.url.base, data);
    }

    putCuentas(data): Observable<any> {
        const id = data.id;
        delete data.id;
        return this._http.post(`${this.appSettings.cuentasBancarias.url.base}/${id}`, data);
    }
}
