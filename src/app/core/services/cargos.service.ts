import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargosService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

    getCargos(): Observable<any> {
        return this._http.get(this.appSettings.cargos.url.base)
    }

    postCargos(data): Observable<any> {
        delete data.id;
        return this._http.post(this.appSettings.cargos.url.base, data)
    }

    putCargos(data): Observable<any> {
        const id = data.id;
        delete data.id;
        return this._http.put(`${this.appSettings.cargos.url.base}/${id}`, data)
    }
}
