import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { DateAdapter, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReportesService } from '../../../../core/services/reportes.service';
import { EstadoCreditosService } from '../../../../core/services/estado-creditos.service';
import { map, tap } from 'rxjs';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { AesEncryptionService } from '../../../../core/services/aes-encryption.service';
import { parseCurrency } from '../../../../core/utils/number-utils';
import { exportar } from '../../../../core/constant/dialogs';
import * as XLSX from 'xlsx';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { Estados } from '../../../../core/enums/estados';

@Component({
  selector: 'app-reporte-desembolsos',
  standalone: true,
    imports: [
        AsyncPipe,
        CdkScrollable,
        CustomTableComponent,
        FuseAlertComponent,
        MatButton,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        MatSuffix,
        NgForOf,
        NgIf,
        ReactiveFormsModule,
        NgClass,
    ],
  templateUrl: './reporte-desembolsos.component.html',
  styleUrl: './reporte-desembolsos.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
    ],
})
export class ReporteDesembolsosComponent {
    public searchTerm: string = '';
    private fb = inject(FormBuilder);
    public form: FormGroup;
    private reportesService = inject(ReportesService);
    private datePipe = inject(DatePipe);
    estados = new FormControl([''])
    private detalleConsumoService = inject(EstadoCreditosService)
    public aesEncriptService = inject(AesEncryptionService);
    private currencyPipe = inject(CurrencyPipe);
    public fuseService = inject(FuseConfirmationService);
    public detalleConsumo$ = this.detalleConsumoService.getDetalleConsumo().pipe(
        map((response) => {
            response.data = response.data.filter((res) =>
                res.nombre !== 'Rechazado' &&
                res.nombre !== 'Pagado' &&
                res.nombre !== 'En Revision' &&
                res.nombre !== 'En Mora'
            );
            return response;
        }),
        tap((response) => {
            const selectedValue = response.data;
            if (selectedValue) {
                this.form.get('idEstadoCredito').setValue(selectedValue[0].id);
            }
        })
    )
    data = [];
    exportData = [];
    columns = ['Fecha de solicitud', 'Identificación', 'Trabajador', 'Empresa', 'Cargo', 'Tipo de contrato', 'Fecha de inicio contrato', 'Fecha fin de contrato', 'Salario devengado', 'Monto aprobado', 'Cupo disponible', 'Tipo de cuenta', 'Banco', 'Cuenta destino', 'Estado'];
    columnPropertyMap = {
        'Fecha de solicitud': 'fechaCreacionSolicitud',
        'Identificación': 'documentoTrabajador',
        'Trabajador': 'nombreTrabajador',
        'Empresa': 'nombreEmpresaTrabajador',
        'Cargo': 'cargoTrabajador',
        'Tipo de contrato': 'tipoContratoTrabajador',
        'Fecha de inicio contrato': 'fechaInicioContratoTrabajador',
        'Fecha fin de contrato': 'fechaFinContratoTrabajador',
        'Salario devengado': 'salarioDevengadoTrabajador',
        'Monto aprobado': 'montoConsumo',
        'Cupo disponible': 'cupoDisponibleTrabajador',
        'Tipo de cuenta': 'tipoCuentaTrabajador',
        'Banco': 'bancotrabajador',
        'Cuenta destino': 'cuentaDestino',
        'Estado': 'nombreEstadoCredito',
    };

    private convertDataExport(data, ) {
        const convertData = data.map((items) => {
            return {
                FechaSolicitud : items.fechaCreacionSolicitud,
                Identificacion : items.documentoTrabajador,
                Trabajador : items.nombreTrabajador,
                Empresa : items.nombreEmpresaTrabajador,
                Cargo : items.cargoTrabajador,
                TipoContrato : items.tipoContratoTrabajador,
                FechaInicioContrato : items.fechaInicioContratoTrabajador,
                FechaFinContrato : items.fechaFinContratoTrabajador,
                SalarioDevengado : parseCurrency(items.salarioDevengadoTrabajador),
                MontoAprobado : parseCurrency(items.montoConsumo),
                CupoDisponible : parseCurrency(items.cupoDisponibleTrabajador),
                TipoCuenta : items.tipoCuentaTrabajador,
                Banco : items.bancotrabajador,
                Cuentadestino : items.cuentaDestino,
                Estado : items.nombreEstadoCredito,
            };
        });
        this.exportData = convertData;
    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    onSelect(estado: MatSelectChange) {
        this.data = [];
        this.exportData = [];
    }

    private createForm() {
        this.form = this.fb.group({
            fechaInicio: ['', Validators.required],
            fechaFinal: ['', Validators.required],
        })
    }

    ngOnInit(): void {
        this.createForm();
    }

    onConsultar() {
        if (this.form.valid) {
            const {fechaInicio, fechaFinal, ...form } = this.form.getRawValue();
            const fechaIniciallData = this.datePipe.transform(fechaInicio, 'yyyy-MM-dd')
            const fechaFinallData = this.datePipe.transform(fechaFinal, 'yyyy-MM-dd')

            const consulta = {
                fechaInicio: fechaIniciallData,
                fechaFinal: fechaFinallData,
            }

            this.reportesService.getReporteDesembolsos(consulta).pipe(
                map((response) => {
                    response.data.forEach((items) => {
                        items.estado = items.estado ? Estados.ACTIVO : Estados.INACTIVO;

                        items.fechaCreacionSolicitud = this.datePipe.transform(items.fechaCreacionSolicitud, 'dd/MM/yyyy');
                        items.fechaInicioContratoTrabajador = this.datePipe.transform(items.fechaInicioContratoTrabajador, 'dd/MM/yyyy');
                        items.fechaFinContratoTrabajador = this.datePipe.transform(items.fechaFinContratoTrabajador, 'dd/MM/yyyy');
                        items.salarioDevengadoTrabajador = this.currencyPipe.transform(items.salarioDevengadoTrabajador, 'USD', 'symbol', '1.2-2');

                        if (items.montoConsumo) {
                            items.montoConsumo = this.aesEncriptService.decrypt(items.montoConsumo);
                        }
                        items.cupoDisponibleTrabajador = this.currencyPipe.transform(items.cupoDisponibleTrabajador, 'USD', 'symbol', '1.2-2');
                        items.montoConsumo = this.currencyPipe.transform(items.montoConsumo, 'USD', 'symbol', '1.2-2');
                    })
                    return response;

                })
            ).subscribe((response) => {
                if (response.data) {
                    this.data = response.data;
                    this.convertDataExport(response.data)
                } else {
                    this.data = [];
                }
            })

        }

    }

    exportToExcel(data: any[]) {
        const dialog = this.fuseService.open({
            ...exportar
        });

        dialog.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                // Create worksheet
                const worksheet = XLSX.utils.json_to_sheet(data);

                // Create workbook
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

                // Export file
                XLSX.writeFile(workbook, `Reporte de Desembolsos${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.xlsx`);
            }
        })

    }

}
