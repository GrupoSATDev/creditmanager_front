import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiposPagosService {

  constructor(
      private _http: HttpClient,
      private appSettingService: AppSettingsService
  ) { }

    getTiposPagos(): Observable<any> {
        return this._http.get(this.appSettingService.tiposPagos.url.base)
    }

    postTiposPagos(data): Observable<any> {
        delete data.id;
        return this._http.post(this.appSettingService.tiposPagos.url.base, data)
    }

    putTiposPagos(data): Observable<any> {
        const id = data.id;
        return this._http.put(`${this.appSettingService.tiposPagos.url.base}/${id}`, data)
    }
}
