import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CobroAliadosService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

    getCobroAliado(param): Observable<any> {
        return this._http.get(`${this.appSettings.cobroAliado.url.base}/Tabla/${param}`)
    }

    getCobroAliados(id): Observable<any> {
        return this._http.get(`${this.appSettings.cobroAliado.url.base}/${id}`)
    }

    putCobroAliado(data): Observable<any> {
      const id = data.id;
      delete data.id;
      return this._http.put(`${this.appSettings.cobroAliado.url.base}/${id}`, data)
    }
}
