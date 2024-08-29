import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettingsService } from '../app-config/app-settings-service';

@Injectable({
  providedIn: 'root'
})
export class EmpresasMaestrasService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  getEmpresas(): Observable<any> {
      return this._http.get(this.appSettings.empresasMaestras.url.base);
  }

  postEmpresa(data): Observable<any> {
      delete data.id;
      return this._http.post(this.appSettings.empresasMaestras.url.base, data)
  }

  putEmpresa(data): Observable<any> {
      const id = data.id;
      delete data.id;
      return this._http.put(`${this.appSettings.empresasMaestras.url.base}/${id}`, data)
  }
}
