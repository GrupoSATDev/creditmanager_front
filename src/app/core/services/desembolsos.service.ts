import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesembolsosService {

  constructor(
      private _http: HttpClient,
      private AppSettings: AppSettingsService,
  ) { }

  postDesembolso(data): Observable<any> {
      return this._http.post(this.AppSettings.detalleConsumos.url.desembolsoBase, data);
  }

}
