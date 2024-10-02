import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscripcionService {

  constructor(
      private _http: HttpClient,
      private appSettingService: AppSettingsService
  ) { }

  getSubcripciones(): Observable<any> {
     return this._http.get(this.appSettingService.subcripciones.url.base)
  }

  getSubcripcion(id): Observable<any> {
     return this._http.get(`${this.appSettingService.subcripciones.url.base}`)
  }
}
