import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasasInteresService {

  constructor(
      private _http: HttpClient,
      private appSettingService: AppSettingsService
  ) { }

    getTass(): Observable<any> {
        return this._http.get(this.appSettingService.tasasIntereses.url.base);
    }

    postTasas(data): Observable<any> {
        delete data.id;
        return this._http.post(this.appSettingService.tasasIntereses.url.base, data);
    }

    putTasas(data): Observable<any> {
        const id = data.id;
        delete data.id;
        return this._http.put(`${this.appSettingService.tasasIntereses.url.base}/${id}`, data);
    }
}
