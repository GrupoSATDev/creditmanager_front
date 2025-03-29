import { Component, inject, OnInit } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ReportesService } from '../../../../core/services/reportes.service';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgIf } from '@angular/common';
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
import { MatTab, MatTabChangeEvent, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { CodigoEstadosCreditosLiquidados } from '../../../../core/enums/estados-creditos';

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
        MatTabGroup,
        MatTab,
        MatTabContent,
        NgIf,
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
    public selectedTab: any = '';
    tabDescription: string = 'Este reporte muestra las personas que han recibido desembolsos pero aún no ha realizado el proceso de liquidación para el cobro. '
    title: string = 'Sin liquidar';
    tabNote: string;
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
    ];
    columnsLiquidado = [
        'Fecha de desembolso',
        'Trabajador',
        'Identificación',
        'Empresa',
        'Valor liquidado',
        'Pagos pendientes',
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
    };
    columnPropertyLiquidadoMap = {
        'Fecha de desembolso': 'fechaDesembolso',
        'Trabajador': 'nombreTrabajador',
        'Identificación': 'documentoTrabajador',
        'Empresa': 'nombreSubEmpresa',
        'Valor liquidado': 'deudaTotal',
        'Pagos pendientes': 'pagosPendientes',
    };

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    ngOnInit(): void {
        this.loadDeudas(this.selectedTab);
    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        if (tabChangeEvent.index === 0) {
            this.title = 'Sin liquidar: ';
            this.tabDescription = 'Este reporte muestra las personas que han recibido desembolsos pero aún no ha realizado el proceso de liquidación para el cobro. ';
        } else {
            this.title = 'Liquidado: ';
            this.tabDescription = 'Este reporte identifica a las personas que tienen uno o más cobros liquidados pero que aún no ha recibido el pago. ';
            this.tabNote = 'Si los intereses a la fecha están en $0, es porque solo tiene pendiente por pagar "Costos Adicionales".'
        }
        this.selectedTab = tabChangeEvent.index == 0 ? '' : CodigoEstadosCreditosLiquidados.LIQUIDADO;
        this.loadDeudas(this.selectedTab);
    }

    private loadDeudas(params) {
        this.reportesService
            .getReporteDeudas(params)
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
                    `Reporte de Deudas${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.xlsx`
                );
            }
        });
    }

    private convertDataExport(data) {
        const convertData = data.map((items) => {
            const mappedItem: any = {
                FechaDesembolso: items.fechaDesembolso,
                Trabajador: items.nombreTrabajador,
                Identificacion: items.documentoTrabajador,
                Empresa: items.nombreSubEmpresa,
                Valorliquidado: parseCurrency(items.deudaTotal),
            };
            if (this.selectedTab == '') {
                mappedItem.InteresesAlaFecha = parseCurrency(items.deudaIntereses)
            }
            if (this.selectedTab == '') {
                mappedItem.CantidadCuotas = items.cantCuotas
            }
            if (this.selectedTab == '') {
                mappedItem.ValorDesembolso = parseCurrency(items.valorDesembolso)
            }
            if (this.selectedTab == '') {
                mappedItem.DeudaCostos = parseCurrency(items.deudaCobroFijo)
            }
            if (this.selectedTab == '') {
                mappedItem.ValorCuota = parseCurrency(items.valorCuota)
            }
            if (this.selectedTab == CodigoEstadosCreditosLiquidados.LIQUIDADO) {
                mappedItem.PagosPendientes = items.pagosPendientes;
            }
            return mappedItem;
        });
        this.exportData = convertData;
    }

    protected readonly CodigoEstadosCreditosLiquidados = CodigoEstadosCreditosLiquidados;
}
