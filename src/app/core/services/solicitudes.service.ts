import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  getSolicitudes(): Observable<any> {
      return this._http.get(this.appSettings.solicitudesCreditos.url.base);
  }

  postSolicitudes(data): Observable<any> {
      delete data.id;
      return this._http.post(this.appSettings.solicitudesCreditos.url.base, data);
  }

  putSolicitudes(data): Observable<any> {
      const id = data.id;
      delete data.id;
      return this._http.put(`${this.appSettings.solicitudesCreditos.url.base}/${id}`, data);
  }

  patchSolicitud(id): Observable<any> {
      return this._http.patch(`${this.appSettings.solicitudesCreditos.url.base}/${id}`, {})
  }
}
