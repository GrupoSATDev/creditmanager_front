import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiposEmpresasService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  getTiposEmpresas(): Observable<any> {
      return this._http.get(this.appSettings.tiposEmpresas.url.base);
  }
}
