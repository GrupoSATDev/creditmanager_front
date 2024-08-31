import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiposDocumentosService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

    getTiposDocumentos(): Observable<any> {
        return this._http.get(this.appSettings.tiposDocumentos.url.base);
    }

    postDocumentos(data): Observable<any> {
      delete data.id;
      return this._http.post(this.appSettings.tiposDocumentos.url.base, data)
    }


}
