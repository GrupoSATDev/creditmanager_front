import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
      private _http: HttpClient,
      private appSettingService: AppSettingsService
  ) { }

    getUsuarios():  Observable<any> {
      return this._http.get(`${this.appSettingService.usuarios.url.base}/Table`)
    }

    getUsuario(id):  Observable<any> {
      return this._http.get(`${this.appSettingService.usuarios.url.base}/Empresa/${id}`)
    }

    postUsuarios(data): Observable<any> {
      delete data.id;
      return this._http.post(`${this.appSettingService.usuarios.url.base}/RegistroEmpresas`, data)
    }

    putUsuario(data):  Observable<any> {
        const id = data.id;
        delete data.id;
        return this._http.put(`${this.appSettingService.usuarios.url.base}/Empresa/${id}`, data)
    }
}
