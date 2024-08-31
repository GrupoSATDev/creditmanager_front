import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettingsService } from '../app-config/app-settings-service';

@Injectable({
  providedIn: 'root'
})
export class EmpresasClientesService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  getEmpresas(): Observable<any> {
      return this._http.get(this.appSettings.empresasClientes.url.base)
  }

  postEmpresaCliente(data): Observable<any> {
      delete data.id;
      return this._http.post(this.appSettings.empresasClientes.url.base, data);
  }

  putEmpresaCliente(data): Observable<any> {
      const id = data.id;
      delete data.id;
      return this._http.post(`${this.appSettings.empresasClientes.url.base}/${id}`, data);
  }

}
