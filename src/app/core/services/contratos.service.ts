import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

    getContratos(): Observable<any> {
        return this._http.get(this.appSettings.tipoContratos.url.base).pipe(
            map((response: any) => {
                return response.data;
            })
        )
    }
}
