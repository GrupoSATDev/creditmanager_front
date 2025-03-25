import { Component, inject, OnInit } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ReportesService } from '../../../../core/services/reportes.service';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { parseCurrency } from '../../../../core/utils/number-utils';
import { MatButton } from '@angular/material/button';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { exportar } from '../../../../core/constant/dialogs';
import * as XLSX from 'xlsx';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { map } from 'rxjs';
import { Estados } from '../../../../core/enums/estados';

@Component({
    selector: 'app-reporte-deudas',
    standalone: true,
    imports: [
        CdkScrollable,
        MatFormField,
        MatIcon,
        MatInput,
        MatButton,
        NgClass,
        CustomTableComponent,
        FuseAlertComponent,
    ],
    templateUrl: './reporte-deudas.component.html',
    styleUrl: './reporte-deudas.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
    ],
})
export class ReporteDeudasComponent implements OnInit {
    public searchTerm: string = '';
    private reportesService = inject(ReportesService);
    private datePipe = inject(DatePipe);
    public fuseService = inject(FuseConfirmationService);
    private currencyPipe = inject(CurrencyPipe);
    data = [];
    exportData = [];
    columns = ['Fecha de desembolso', 'Trabajador', 'Identificación', 'Empresa', 'Cantidad cuota', 'Valor desembolso', 'Deuda', 'Deuda intereses', 'Valor cuota', 'Deuda costos', ];
    columnPropertyMap = {
        'Fecha de desembolso': 'fechaDesembolso',
        'Trabajador': 'nombreTrabajador',
        'Identificación': 'documentoTrabajador',
        'Empresa': 'nombreSubEmpresa',
        'Cantidad cuota': 'cantCuotas',
        'Valor desembolso': 'valorDesembolso',
        'Deuda': 'deudaTotal',
        'Deuda intereses': 'deudaIntereses',
        'Valor cuota': 'valorCuota',
        'Deuda costos': 'deudaCobroFijo',
    };

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    ngOnInit(): void {
        this.loadDeudas();
    }

    private loadDeudas() {
        this.reportesService.getReporteDeudas().pipe(
            map((response) => {
                response.data.forEach((items) => {

                    items.fechaDesembolso = this.datePipe.transform(items.fechaDesembolso, 'dd/MM/yyyy');
                    items.valorDesembolso = this.currencyPipe.transform(items.valorDesembolso, 'USD', 'symbol', '1.2-2');
                    items.deudaTotal = this.currencyPipe.transform(items.deudaTotal, 'USD', 'symbol', '1.2-2');
                    items.deudaIntereses = this.currencyPipe.transform(items.deudaIntereses, 'USD', 'symbol', '1.2-2');
                    items.valorCuota = this.currencyPipe.transform(items.valorCuota, 'USD', 'symbol', '1.2-2');
                    items.deudaCobroFijo = this.currencyPipe.transform(items.deudaCobroFijo, 'USD', 'symbol', '1.2-2');
                })
                return response;

            })
        ).subscribe((response) => {
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
                XLSX.writeFile(workbook, `Reporte de Deudas${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.xlsx`);
            }
        })

    }

    private convertDataExport(data) {
        const convertData = data.map((items) => {
            return {
                FechaDesembolso: items.fechaDesembolso,
                Trabajador: items.nombreTrabajador,
                Identificacion: items.documentoTrabajador,
                Empresa: items.nombreSubEmpresa,
                CantidadCuotas: items.cantCuotas,
                ValorDesembolso: parseCurrency(items.valorDesembolso),
                Deuda: parseCurrency(items.deudaTotal),
                DeudaIntereses: parseCurrency(items.deudaIntereses),
                ValorCuota: parseCurrency(items.valorCuota),
                DeudaCostos: parseCurrency(items.deudaCobroFijo),
            };
        });
        this.exportData = convertData;
    }
}
