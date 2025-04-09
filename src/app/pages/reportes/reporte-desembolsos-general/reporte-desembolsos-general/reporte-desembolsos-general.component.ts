import { Component, inject, OnInit } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { ReportesService } from '../../../../core/services/reportes.service';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { map } from 'rxjs';
import { exportar } from '../../../../core/constant/dialogs';
import * as XLSX from 'xlsx';
import { parseCurrency } from '../../../../core/utils/number-utils';

@Component({
    selector: 'app-reporte-desembolsos-general',
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
    templateUrl: './reporte-desembolsos-general.component.html',
    styleUrl: './reporte-desembolsos-general.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
    ],
})
export class ReporteDesembolsosGeneralComponent implements OnInit {
    public searchTerm: string = '';
    private reportesService = inject(ReportesService);
    private datePipe = inject(DatePipe);
    public fuseService = inject(FuseConfirmationService);
    private currencyPipe = inject(CurrencyPipe);
    title: string = 'Desembolsos';
    tabDescription: string = 'Este reporte muestra todos los desembolsos que se han realizado y el estado en que se encuentran.'
    data = [];
    exportData = [];
    columns = [
        'Fecha de desembolso',
        'Trabajador',
        'Identificación',
        'Empresa',
        'Cantidad cuotas',
        'Valor desembolso',
        'Deuda a la fecha',
        'Intereses a la fecha',
        'Valor cuota',
        'Deuda costos',
        'Recaudado',
        'Estado'
    ];
    columnPropertyMap = {
        'Fecha de desembolso': 'fechaDesembolso',
        'Trabajador': 'nombreTrabajador',
        'Identificación': 'documentoTrabajador',
        'Empresa': 'nombreSubEmpresa',
        'Cantidad cuotas': 'cantCuotas',
        'Valor desembolso': 'valorDesembolso',
        'Deuda a la fecha': 'deudaTotal',
        'Intereses a la fecha': 'deudaIntereses',
        'Valor cuota': 'valorCuota',
        'Deuda costos': 'deudaCobroFijo',
        'Recaudado': 'recaudado',
        'Estado': 'estado',
    };
    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    ngOnInit(): void {
        this.loadDeudas();
    }

    private loadDeudas() {
        this.reportesService
            .getReporteGeneral()
            .pipe(
                map((response) => {
                    response.data.forEach((items) => {
                        items.fechaDesembolso = this.datePipe.transform(
                            items.fechaDesembolso,
                            'dd/MM/yyyy'
                        );
                        items.valorDesembolso = this.currencyPipe.transform(
                            items.valorDesembolso,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );
                        items.recaudado = this.currencyPipe.transform(
                            items.recaudado,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );
                        items.deudaTotal = this.currencyPipe.transform(
                            items.deudaTotal,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );
                        items.deudaIntereses = this.currencyPipe.transform(
                            items.deudaIntereses,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );

                        items.valorCuota = this.currencyPipe.transform(
                            items.valorCuota,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );
                        items.deudaCobroFijo = this.currencyPipe.transform(
                            items.deudaCobroFijo,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );
                    });
                    return response;
                })
            )
            .subscribe((response) => {
                if (response.data) {
                    this.data = response.data;
                    this.convertDataExport(response.data);
                } else {
                    this.data = [];
                }
            });
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
                    `Reporte general desembolsos ${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.xlsx`
                );
            }
        });
    }

    private convertDataExport(data) {
        const convertData = data.map((items) => {
            const mappedItem: any = {
                FechaDeDesembolso: items.fechaDesembolso,
                Trabajador: items.nombreTrabajador,
                Identificacion: items.documentoTrabajador,
                Empresa: items.nombreSubEmpresa,
            };

            mappedItem.CantidadCuotas = items.cantCuotas;

            mappedItem.ValorDesembolso = parseCurrency(items.valorDesembolso);

            mappedItem.DeudaAlaFecha = parseCurrency(items.deudaTotal);

            mappedItem.InteresesAlaFecha = parseCurrency(items.deudaIntereses);

            mappedItem.ValorCuota = parseCurrency(items.valorCuota);

            mappedItem.DeudaCostos = parseCurrency(items.deudaCobroFijo);

            mappedItem.Recaudado = parseCurrency(items.recaudado);
            mappedItem.Estado = items.estado;

            return mappedItem;
        });
        this.exportData = convertData;
    }
}
