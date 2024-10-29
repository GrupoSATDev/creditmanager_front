import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BancosService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

    getBancos(): Observable<any> {
        return this._http.get(this.appSettings.bancos.url.base)
    }

    getBanco(id): Observable<any> {
        return this._http.get(`${this.appSettings.bancos.url.base}/${id}`)
    }

    postBancos(data): Observable<any> {
        delete data.id;
        return this._http.post(this.appSettings.bancos.url.base, data)
    }

    putBancos(data): Observable<any> {
        const id = data.id
        delete data.id;
        return this._http.put(`${this.appSettings.bancos.url.base}/${id}`, data)
    }
}
