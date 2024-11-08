import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';
import { data } from 'autoprefixer';

@Injectable({
  providedIn: 'root'
})
export class CapitalInversionService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  getCapitales(): Observable<any> {
      return this._http.get(this.appSettings.capitalInversion.url.base)
  }

  getCapital(id): Observable<any> {
      return this._http.get(`${this.appSettings.capitalInversion.url.base}/${id}`)
  }

  postCapitales(data): Observable<any> {
      delete data.id;
      return this._http.post(this.appSettings.capitalInversion.url.base, data)
  }

  putCapitales(data): Observable<any> {
      const id = data.id;
      return this._http.put(`${this.appSettings.capitalInversion.url.base}/${id}`, data)
  }
}
