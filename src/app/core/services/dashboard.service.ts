import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  getIndicadores(): Observable<any>  {
      return this._http.get(`${this.appSettings.dashboard.url.base}/EmpresaMaestra`)
  }

  getCardsMontos(): Observable<any> {
      return this._http.get(`${this.appSettings.dashboard.url.base}/Montos`)
  }

  getRentabilidadInteres(): Observable<any> {
      return this._http.get(`${this.appSettings.dashboard.url.base}/Intereses`)
  }

  getCarteras(): Observable<any> {
      return this._http.get(`${this.appSettings.dashboard.url.base}/Carteras`)
  }
}
