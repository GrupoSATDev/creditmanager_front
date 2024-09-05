import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

    getEmpleados(): Observable<any> {
        return this._http.get(this.appSettings.empleados.url.base)
    }

    postEmpleados(data): Observable<any> {
        delete data.id;
        return this._http.post(this.appSettings.empleados.url.base, data)
    }

    putEmpleados(data): Observable<any> {
        const id = data.id;
        delete data.id;
        return this._http.put(`${this.appSettings.empleados.url.base}/${id}`, data)
    }
}
