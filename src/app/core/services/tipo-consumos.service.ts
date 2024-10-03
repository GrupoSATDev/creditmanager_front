import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoConsumosService {

  constructor(
      private _http: HttpClient,
      private appSettingService: AppSettingsService
  ) { }

  getTipoConsumos(): Observable<any> {
      return this._http.get(this.appSettingService.tipoConsumos.url.base);
  }

  getTipoConsumo(id): Observable<any> {
      return this._http.get(`${this.appSettingService.tipoConsumos.url.base}/${id}`);
  }
}
