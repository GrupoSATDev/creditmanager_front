import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesembolsosService {

  constructor(
      private _http: HttpClient,
      private AppSettings: AppSettingsService,
  ) { }

  postDesembolso(data): Observable<any> {
      return this._http.post(this.AppSettings.detalleConsumos.url.desembolsoBase, data);
  }

  patchDesembolso(data): Observable<any> {
      const id = data.id;
      delete data.id;
      const {idEstado, cuentaDestino, numFactura, idCuentaBancaria } = data;
      return this._http.patch(`${this.AppSettings.detalleConsumos.url.base}/Desembolso/${id}?idEstado=${idEstado}&numFactura=${numFactura}&cuentaDestino=${cuentaDestino}&idCuentaBancaria=${idCuentaBancaria}`,{} )
  }

}
