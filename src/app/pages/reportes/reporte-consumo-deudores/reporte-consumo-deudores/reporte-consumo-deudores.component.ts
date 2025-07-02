import { Component, inject, OnInit } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { ReportesService } from '../../../../core/services/reportes.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { map } from 'rxjs';
import { parseCurrency } from '../../../../core/utils/number-utils';
import { exportar } from '../../../../core/constant/dialogs';
import * as XLSX from 'xlsx';
import { AesEncryptionService } from '../../../../core/services/aes-encryption.service';

@Component({
    selector: 'app-reporte-consumo-deudores',
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
    templateUrl: './reporte-consumo-deudores.component.html',
    styleUrl: './reporte-consumo-deudores.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
    ],
})
export class ReporteConsumoDeudoresComponent implements OnInit {
    public searchTerm: string = '';
    private reportesService = inject(ReportesService);
    private datePipe = inject(DatePipe);
    data = [];
    private currencyPipe = inject(CurrencyPipe);
    exportData = [];
    public fuseService = inject(FuseConfirmationService);
    private aesEncriptService = inject(AesEncryptionService);

    columns = [
        'Empresa',
        'Identificacion',
        'Trabajador',
        'Crédito',
        'Fecha creación',
        'Cupo aprobado',
        'Cupo consumido',
        'Cupo disponible',
    ];
    columnPropertyMap = {
        Empresa: 'nombreSubEmpresa',
        Identificacion: 'docTrabajador',
        Trabajador: 'nombreTrabajador',
        Crédito: 'numCredito',
        'Fecha creación': 'fechaCreacion',
        'Cupo aprobado': 'cupoAprobado',
        'Cupo consumido': 'cupoConsumido',
        'Cupo disponible': 'cupoDisponible',
    };

    ngOnInit(): void {
        this.onConsultar()
    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    onConsultar() {
        this.reportesService
            .getConsumoDeudores()
            .pipe(
                map((response) => {
                    response.data.forEach((items) => {
                        if (items.cupoAprobado) {
                            items.cupoAprobado = this.aesEncriptService.decrypt(items.cupoAprobado);
                        }
                        if (items.cupoConsumido) {
                            items.cupoConsumido = this.aesEncriptService.decrypt(items.cupoConsumido);
                        }
                        if (items.cupoDisponible) {
                            items.cupoDisponible = this.aesEncriptService.decrypt(items.cupoDisponible);
                        }

                        items.cupoAprobado = this.currencyPipe.transform(
                            items.cupoAprobado,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );
                        items.cupoConsumido = this.currencyPipe.transform(
                            items.cupoConsumido,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );
                        items.cupoDisponible = this.currencyPipe.transform(
                            items.cupoDisponible,
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

    private convertDataExportFijos(data) {
        const convertData = data.map((items) => {
            return {
                Empresa: items.nombreSubEmpresa,
                Identificacion: items.docTrabajador,
                Trabajador: items.nombreTrabajador,
                Crédito: items.numCredito,
                FechaCreacion: items.fechaCreacion,
                'CupoAprobado': parseCurrency(items.cupoAprobado),
                'CupoConsumido': parseCurrency(items.cupoConsumido),
                'CupoDisponible': parseCurrency(items.cupoDisponible),
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
                    `Reporte consumo deudores${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.xlsx`
                );
            }
        });
    }
}
