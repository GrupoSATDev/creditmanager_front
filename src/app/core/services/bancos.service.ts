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
}
