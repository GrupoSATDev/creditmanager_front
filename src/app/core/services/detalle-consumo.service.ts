import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetalleConsumoService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  getDetalle(param): Observable<any> {
      return this._http.get(`${this.appSettings.detalleConsumos.url.base}/DetalleConsumo/${param}`);
  }

  getConsumo(id): Observable<any> {
      return this._http.get(`${this.appSettings.detalleConsumos.url.base}/${id}`);
  }

  getDetalleConsumoDesembolsos(): Observable<any> {
      return this._http.get(`${this.appSettings.detalleConsumos.url.desembolso}`);
  }

  getDetalleConsumoDesembolsosRealizado(params): Observable<any> {
      return this._http.get(`${this.appSettings.detalleConsumos.url.detalleDesembolsoRealizado}/${params}`);
  }

  getDetalleConsumoDesembolso(id): Observable<any> {
      return this._http.get(`${this.appSettings.detalleConsumos.url.desembolso}/${id}`);
  }

  getDetallesConsumoDesembolsos(id): Observable<any> {
      return this._http.get(`${this.appSettings.detalleConsumos.url.desembolsos}/${id}`);
  }

    getConsumoTrabajador(id): Observable<any> {
        return this._http.get(`${this.appSettings.detalleConsumos.url.baseTrabajador}/${id}`);
    }

  postDetalle(data) : Observable<any> {
      return this._http.post(this.appSettings.detalleConsumos.url.base, data);
  }
 postDesembolso(data) : Observable<any> {
      return this._http.post(this.appSettings.detalleConsumos.url.base, data);
  }

  getResumen(id): Observable<any> {
      return this._http.get(`${this.appSettings.detalleConsumos.url.base}/trabajador/${id}`)
  }

  getPagosAliados(data): Observable<any> {
      const {fechaFinallData, idSubEmpresa} = data;
      return this._http.get( `${this.appSettings.detalleConsumos.url.aliado}?fechaFinal=${fechaFinallData}&IdSubEmpresa=${idSubEmpresa}`);
  }

  patchConsumo(data): Observable<any> {
    const id = data.id;
    delete data.id;
    const {idEstado} = data;
    return this._http.patch(`${this.appSettings.detalleConsumos.url.base}/${id}?idEstado=${idEstado}`,{} )
  }

  postConsumoFijo(data): Observable<any> {
      return this._http.post(this.appSettings.detalleConsumos.url.cobroFijo, data);
  }

  deleteCobroFijo(id): Observable<any> {
      return this._http.delete(`${this.appSettings.detalleConsumos.url.cobroFijoEliminar}/${id}`);
  }
}
