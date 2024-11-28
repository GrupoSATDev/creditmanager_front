import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

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
      const {idEstado, idCuentaDestino, numeroFactura, idCuentaBancaria } = data;
      return this._http.patch(`${this.AppSettings.detalleConsumos.url.base}/${id}?idEstado=${idEstado}&numFactura=${numeroFactura}&cuentaDestino=${idCuentaDestino}&idCuentaBancaria=${idCuentaBancaria}`,{} )
  }

}
