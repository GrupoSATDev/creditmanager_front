import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NivelRiesgoService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  getRiesgos(): Observable<any> {
      return this._http.get(this.appSettings.riesgos.url.base)
  }

  getRiesgo(id): Observable<any> {
      return this._http.get(`${this.appSettings.riesgos.url.base}/${id}`)
  }
}
