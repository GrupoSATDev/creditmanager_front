import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettingsService } from '../app-config/app-settings-service';

@Injectable({
  providedIn: 'root'
})
export class LocacionService {

  constructor(
      private _http: HttpClient,
      private appSettingService: AppSettingsService
  ) { }

  getDepartamentos(): Observable<any> {
      return this._http.get(this.appSettingService.departamentos.url.base);
  }

  getMunicipio(id): Observable<any> {
      return this._http.get(`${this.appSettingService.municipios.url.base}/${id}`)
  }

  postDepartamento(data): Observable<any> {
      delete data.id;
      return this._http.post(this.appSettingService.departamentos.url.base, data)
  }

  putDepartamento(data): Observable<any> {
      const id = data.id;
      delete data.id;
      return this._http.put(`${this.appSettingService.departamentos.url.base}/${id}`, data)
  }
}
