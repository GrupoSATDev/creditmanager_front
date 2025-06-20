import { Component, inject, OnInit } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReportesService } from '../../../../core/services/reportes.service';
import { AesEncryptionService } from '../../../../core/services/aes-encryption.service';
import { TipoSolicitudesService } from '../../../../core/services/tipo-solicitudes.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { map } from 'rxjs';
import { parseCurrency } from '../../../../core/utils/number-utils';
import { exportar } from '../../../../core/constant/dialogs';
import * as XLSX from 'xlsx';



@Component({
    selector: 'app-reporte-recupera-inversion',
    standalone: true,
    imports: [
        CdkScrollable,
        CustomTableComponent,
        FuseAlertComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        NgClass,
    ],
    templateUrl: './reporte-recupera-inversion.component.html',
    styleUrl: './reporte-recupera-inversion.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
    ],
})
export class ReporteRecuperaInversionComponent implements OnInit {
    public searchTerm: string = '';
    private fb = inject(FormBuilder);
    public form: FormGroup;
    private reportesService = inject(ReportesService);
    private datePipe = inject(DatePipe);
    estados = new FormControl(['']);
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
        'Crédito',
        'Fecha desembolso',
        'Fecha vencimiento',
        'Cuotas pagadas',
        'Cuotas pendientes',
        '0-30 días',
        '60 días',
        '90 días',
        '180 días',
        '360 días',
        'Saldo capital',
        'Intereses generales',
        'Costos asociados',
    ];
    columnPropertyMap = {
        'Empresa': 'nombreSubEmpresa',
        'Identificacion': 'documentoTrabajador',
        'Trabajador': 'nombreTrabajador',
        'Crédito': 'numeroCredito',
        'Fecha desembolso': 'fechaDesembolso',
        'Fecha vencimiento': 'fechaVencimiento',
        'Cuotas pagadas': 'cantCuotasPagadas',
        'Cuotas pendientes': 'cantCuotasPendientes',
        '0-30 días': 'dias30',
        '60 días': 'dias60',
        '90 días': 'dias90',
        '180 días': 'dias180',
        '360 días': 'dias360',
        'Saldo capital': 'saldoCapital',
        'Intereses generales': 'interesesGenerados',
        'Costos asociados': 'costosAsociados',
    };

    ngOnInit(): void {
        this.onConsultar();
    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }



    onConsultar() {
        this.reportesService
            .getInversion()
            .pipe(
                map((response) => {
                    response.data.forEach((items) => {
                        items.saldoCapital = this.currencyPipe.transform(
                            items.saldoCapital,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );
                        items.interesesGenerados = this.currencyPipe.transform(
                            items.interesesGenerados,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );
                        items.costosAsociados = this.currencyPipe.transform(
                            items.costosAsociados,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );
                        items.dias30 = this.currencyPipe.transform(
                            items.dias30,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );
                        items.dias60 = this.currencyPipe.transform(
                            items.dias60,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );
                        items.dias90 = this.currencyPipe.transform(
                            items.dias90,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );
                        items.dias180 = this.currencyPipe.transform(
                            items.dias180,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );
                        items.dias360 = this.currencyPipe.transform(
                            items.dias360,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );
                        items.fechaDesembolso = this.datePipe.transform(
                            items.fechaDesembolso,
                            'dd/MM/yyyy'
                        );

                        items.fechaVencimiento = this.datePipe.transform(
                            items.fechaVencimiento,
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

    private convertDataExportFijos(data) {
        const convertData = data.map((items) => {
            return {
                Empresa: items.nombreSubEmpresa,
                Identificacion: items.documentoTrabajador,
                Trabajador: items.nombreTrabajador,
                Crédito: items.numeroCredito,
                FechaDesembolso: items.fechaDesembolso,
                FechaVencimiento: items.fechaVencimiento,
                CuotasPagadas: items.cantCuotasPagadas,
                CuotasPendientes: items.cantCuotasPendientes,
                '0-30 días': parseCurrency(items.dias30),
                '60 días': parseCurrency(items.dias60),
                '90 días': parseCurrency(items.dias90),
                '180 días': parseCurrency(items.dias180),
                '360 días': parseCurrency(items.dias360),
                'Saldo capital': parseCurrency(items.saldoCapital),
                'Intereses generales': parseCurrency(items.interesesGenerados),
                'Costos asociados': parseCurrency(items.costosAsociados),
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
                    `Reporte recuperación de inversión${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.xlsx`
                );
            }
        });
    }


}
