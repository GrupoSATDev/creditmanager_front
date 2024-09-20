import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetalleConsumoService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  postDetalle(data) : Observable<any> {
      return this._http.post(this.appSettings.detalleConsumos.url.base, data)
  }
}
