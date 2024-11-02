import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CobroTrabajadoresService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  getCobros(): Observable<any> {
      return this._http.get(this.appSettings.cobroTrabajadores.url.base)
  }

  getCobroEmpleado(id): Observable<any> {
      return this._http.get(`${this.appSettings.cobroTrabajadores.url.base}/${id}`)
  }

  getCobrosGrid(idEstado): Observable<any> {
      return this._http.get(`${this.appSettings.cobroTrabajadores.url.baseTabla}/${idEstado}`)
  }

    getCobroTrabajadores(data): Observable<any> {
        const {fechaFinallData, idSubEmpresa} = data;
        return this._http.get( `${this.appSettings.cobroTrabajadores.url.baseTrabajador}?fechaFinal=${fechaFinallData}&IdSubEmpresa=${idSubEmpresa}`);
    }

    getCobroTrabajador(data): Observable<any> {
        const {fechaFinallData, idSubEmpresa, idTrabajador} = data;
        return this._http.get( `${this.appSettings.cobroTrabajadores.url.baseTrabajadorIndividual}?fechaFinal=${fechaFinallData}&IdSubEmpresa=${idSubEmpresa}&Idtrabajador=${idTrabajador}`);
    }



}
