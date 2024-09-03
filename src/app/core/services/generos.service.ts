import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettingsService } from '../app-config/app-settings-service';

@Injectable({
  providedIn: 'root'
})
export class GenerosService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  getGeneros(): Observable<any> {
      return this._http.get(this.appSettings.generos.url.base)
  }

  postGeneros(data): Observable<any> {
      delete data.id;
      return this._http.post(this.appSettings.generos.url.base, data)
  }

  putGeneros(data): Observable<any> {
      const id = data.id;
      delete data.id;
      return this._http.put(`${this.appSettings.generos.url.base}/${id}`, data)
  }
}
