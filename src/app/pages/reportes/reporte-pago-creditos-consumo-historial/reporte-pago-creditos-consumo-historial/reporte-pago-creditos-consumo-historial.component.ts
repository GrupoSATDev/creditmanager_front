import { Component, inject, OnInit } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { ReportesService } from '../../../../core/services/reportes.service';
import { AesEncryptionService } from '../../../../core/services/aes-encryption.service';
import { TipoSolicitudesService } from '../../../../core/services/tipo-solicitudes.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { parseCurrency } from '../../../../core/utils/number-utils';
import { exportar } from '../../../../core/constant/dialogs';
import * as XLSX from 'xlsx';
import { map } from 'rxjs';

@Component({
    selector: 'app-reporte-pago-creditos-consumo-historial',
    standalone: true,
    imports: [
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
        MatSuffix,
        ReactiveFormsModule,
        NgClass,
    ],
    templateUrl: './reporte-pago-creditos-consumo-historial.component.html',
    styleUrl: './reporte-pago-creditos-consumo-historial.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
    ],
})
export class ReportePagoCreditosConsumoHistorialComponent implements OnInit {
    public searchTerm: string = '';
    private fb = inject(FormBuilder);
    public form: FormGroup;
    private reportesService = inject(ReportesService);
    private datePipe = inject(DatePipe);
    data = [];
    private aesEncriptService = inject(AesEncryptionService);
    private tipoSolicitudesService = inject(TipoSolicitudesService);
    private currencyPipe = inject(CurrencyPipe);
    exportData = [];
    public fuseService = inject(FuseConfirmationService);

    columns = [
        'Empresa',
        'Identificacion',
        'Trabajador',
        'Comprobante',
        'Consecutivo',
        'Tipo de registro',
        'Fecha de creación',
        'Valor de registro',
    ];
    columnPropertyMap = {
        Empresa: 'nombreSubEmpresa',
        'Identificacion': 'documentoTrabajador',
        'Trabajador': 'nombreTrabajador',
        'Comprobante': 'comprobante',
        Consecutivo: 'consecutivo',
        'Tipo de registro': 'tipoPago',
        'Fecha de creación': 'fechaCreacion',
        'Valor de registro': 'valorPago',
    };

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    ngOnInit(): void {
        this.createForm();
    }

    onConsultar() {
        if (this.form.valid) {
            const { fechaInicio, fechaFinal } = this.form.getRawValue();
            const fechaIniciallData = this.datePipe.transform(
                fechaInicio,
                'yyyy-MM-dd'
            );
            const fechaFinallData = this.datePipe.transform(
                fechaFinal,
                'yyyy-MM-dd'
            );

            let consulta = {
                fechaInicio: fechaIniciallData,
                fechaFinal: fechaFinallData,
            };

            console.log(consulta);

            this.reportesService
                .getReportePagoCreditosConsumoHistorial(consulta)
                .pipe(
                    map((response) => {
                        response.data.forEach((items) => {
                            items.valorPago =
                                this.currencyPipe.transform(
                                    items.valorPago,
                                    'USD',
                                    'symbol',
                                    '1.2-2'
                                );

                            items.fechaCreacion = this.datePipe.transform(
                                items.fechaCreacion,
                                'dd/MM/yyyy'
                            );

                        });
                        return response;
                    })
                )
                .subscribe((response) => {
                    if (response.data) {
                        this.data = response.data;
                        this.convertDataExportFijos(response.data);
                    } else {
                        this.data = [];
                    }
                });
        }
    }

    private convertDataExportFijos(data) {
        const convertData = data.map((items) => {
            return {
                Empresa: items.nombreSubEmpresa,
                'Identificacion': items.documentoTrabajador,
                'Trabajador': items.nombreTrabajador,
                'Comprobante': items.comprobante,
                'Consecutivo': items.consecutivo,
                'TipodeRegistro': items.tipoPago,
                'FechadeCreación': items.fechaCreacion,
                'ValordeRegistro': parseCurrency(items.valorPago),
            };
        });
        this.exportData = convertData;
    }

    exportToExcel(data: any[]) {
        const dialog = this.fuseService.open({
            ...exportar,
        });

        dialog.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                // Create worksheet
                const worksheet = XLSX.utils.json_to_sheet(data);

                // Create workbook
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

                // Export file
                XLSX.writeFile(
                    workbook,
                    `Reporte de creditos consumo historial${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.xlsx`
                );
            }
        });
    }

    private createForm() {
        this.form = this.fb.group({
            fechaInicio: ['', Validators.required],
            fechaFinal: ['', Validators.required],
        });
    }
}
