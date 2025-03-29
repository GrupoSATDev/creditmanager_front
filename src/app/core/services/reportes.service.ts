import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-config/app-settings-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(
      private _http: HttpClient,
      private appSettings: AppSettingsService
  ) { }

  getReporteConsumo(data): Observable<any> {
      console.log(data)
      return this._http.get(`${this.appSettings.reportes.url.reporteConsumo}?idEstadoCredito=${data.idEstadoCredito}&fechaInicio=${data.fechaInicio}&fechaFinal=${data.fechaFinal}`)
  }

  getReporteDesembolsos(data): Observable<any> {
      console.log(data)
      return this._http.get(`${this.appSettings.reportes.url.reporteDesembolso}?fechaInicio=${data.fechaInicio}&fechaFinal=${data.fechaFinal}`)
  }

    getReporteCobros(data): Observable<any> {
        console.log(data)
        return this._http.get(`${this.appSettings.reportes.url.reporteCobro}?idEstadoCredito=${data.idEstadoCredito}&fechaInicio=${data.fechaInicio}&fechaFinal=${data.fechaFinal}`)
    }

    getReporteSolicitudes(data): Observable<any> {
        console.log(data)
        return this._http.get(`${this.appSettings.reportes.url.reporteSolicitudes}?idTipoSolicitud=${data.idTipoSolicitud}&fechaInicio=${data.fechaInicio}&fechaFinal=${data.fechaFinal}`)
    }

    getReporteDeudas(param): Observable<any> {
      return this._http.get(`${this.appSettings.reportes.url.reporteDeudas}?idEstadoCredito=${param}`)
    }
}
