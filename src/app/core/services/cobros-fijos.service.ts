import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CobrosFijosService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  getCobros(): Observable<any> {
      return this._http.get(this.appSettings.cobrosFijos.url.base)
  }

  getCobro(id): Observable<any> {
      return this._http.get(`${this.appSettings.cobrosFijos.url.base}/${id}`)
  }

  postCobros(data): Observable<any> {
      delete data.id;
      return this._http.post(this.appSettings.cobrosFijos.url.base, data)
  }

  putCobros(data): Observable<any> {
      const id = data.id;
      delete data.id;
      return this._http.put(`${this.appSettings.cobrosFijos.url.base}/${id}`, data)
  }
}
