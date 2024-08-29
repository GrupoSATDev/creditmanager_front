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
      return this._http.post(this.appSettings.empresasMaestras.url.base, data)
  }
}
