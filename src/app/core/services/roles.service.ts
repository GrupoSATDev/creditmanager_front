import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(
      private _http: HttpClient,
      private appSettingService: AppSettingsService
  ) { }

    getRoles(): Observable<any> {
        return this._http.get(`${this.appSettingService.roles.url.base}`)
    }

}
