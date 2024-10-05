import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoSolicitudesService {

    constructor(
        private _http: HttpClient,
        private appSettings: AppSettingsService
    ) {
    }

    getTipos(): Observable<any> {
        return this._http.get(this.appSettings.tipoSolicitudes.url.base)

    }
}
