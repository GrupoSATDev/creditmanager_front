import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { CurrencyPipe, DatePipe, NgClass, NgIf } from '@angular/common';
import { Subscription, tap } from 'rxjs';
import { PagoAliadosService } from '../../../../core/services/pago-aliados.service';
import { MatDialog } from '@angular/material/dialog';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { Router } from '@angular/router';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { PagoTrabajadoresService } from '../../../../core/services/pago-trabajadores.service';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { MatTab, MatTabChangeEvent, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { CodigoCobroTrabajador } from '../../../../core/enums/codigo-cobro-trabajador';
import { DialogEstadoMasivoComponent } from '../dialog-estado-masivo/dialog-estado-masivo.component';
import { DialogAbonosMasivosComponent } from '../dialog-abonos-masivos/dialog-abonos-masivos.component';
import { exportar } from '../../../../core/constant/dialogs';
import * as XLSX from 'xlsx';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { parseCurrency } from '../../../../core/utils/number-utils';

@Component({
    selector: 'app-grid-pago-trabajadores',
    standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        FuseAlertComponent,
        MatTab,
        MatTabContent,
        MatTabGroup,
        NgIf,
        NgClass,
    ],
    providers: [DatePipe, CurrencyPipe],
    templateUrl: './grid-pago-trabajadores.component.html',
    styleUrl: './grid-pago-trabajadores.component.scss',
})
export class GridPagoTrabajadoresComponent implements OnInit, OnDestroy {
    private datePipe = inject(DatePipe);
    public subcription$: Subscription;
    public selectedData: any;
    public searchTerm: string = '';
    private currencyPipe = inject(CurrencyPipe);

    private pagoTrabajadorService = inject(PagoTrabajadoresService);
    private _matDialog = inject(MatDialog);
    private estadoDatosService = inject(EstadosDatosService);
    private router = inject(Router);
    private selectedTab: any = CodigoCobroTrabajador.PENDIENTES;
    public fuseService = inject(FuseConfirmationService);
    public tabIndex;

    data = [];
    exportData = [];

    columns = [
        'Fecha de liquidación',
        'Número de pago',
        'Empresa',
        'Valor',
        'Estado',
    ];
    columnPropertyMap = {
        'Fecha de liquidación': 'fechaCreacion',
        'Número de pago': 'consecutivo',
        Empresa: 'nombreSubempresa',
        Valor: 'total',
        Estado: 'nombreEstadoCobro',
    };

    buttons: IButton[] = [
        {
            label: 'Ver',
            icon: 'visibility',
            action: (element) => {
                console.log('Editing', element);
                this.router.navigate([
                    '/pages/gestion-cobros/trabajadores/pago/',
                    element.id,
                ]);
            },
        },
        {
            label: 'Cambiar estado',
            icon: 'published_with_changes',
            action: (element) => {
                console.log('View', element);
                this.selectedData = element;
                this.onCambioEstado();
            },
        },
        {
            label: 'Abonos',
            icon: 'request_quote',
            action: (element) => {
                console.log('View', element);
                this.selectedData = element;
                this.onAbono();
            },
        },
        {
            label: 'Comprobante',
            icon: 'document_scanner',
            action: (element) => {
                console.log('Editing', element);
                this.router.navigate([
                    '/pages/gestion-cobros/trabajador/individual/',
                    element.id,
                ]);
            },
        },
    ];

    buttonsPagado: IButton[] = [
        {
            label: 'Ver',
            icon: 'visibility',
            action: (element) => {
                console.log('Editing', element);
                this.router.navigate([
                    '/pages/gestion-cobros/trabajadores/pago/',
                    element.id,
                ]);
            },
        },
        {
            label: 'Comprobante',
            icon: 'document_scanner',
            action: (element) => {
                console.log('Editing', element);
                this.router.navigate([
                    '/pages/gestion-cobros/trabajador/individual/',
                    element.id,
                ]);
            },
        },
    ];

    onCambioEstado(): void {
        this._matDialog.open(DialogEstadoMasivoComponent, {
            autoFocus: false,
            data: {
                edit: true,
                data: this.selectedData,
            },
            width: '35%',
            disableClose: true,
            panelClass: 'custom-dialog-container',
        });
    }

    onAbono(): void {
        this._matDialog.open(DialogAbonosMasivosComponent, {
            autoFocus: false,
            data: {
                edit: true,
                data: this.selectedData,
            },
            width: '35%',
            disableClose: true,
            panelClass: 'custom-dialog-container',
        });
    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        this.tabIndex = tabChangeEvent.index;
        this.selectedTab =
            tabChangeEvent.index == 0
                ? CodigoCobroTrabajador.PENDIENTES
                : CodigoCobroTrabajador.PAGADOS;
        this.getPagoTrabajadores(this.selectedTab);
    };

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
                    this.selectedTab == CodigoCobroTrabajador.PENDIENTES ?
                    `Registro de cobro masivo Pendientes${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.xlsx`
                    :
                    `Registro de cobro masivo Pagados${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.xlsx`
                );
            }
        });
    }

    ngOnDestroy(): void {}

    ngOnInit(): void {
        this.getPagoTrabajadores(this.selectedTab);
        this.listenGrid();
    }

    onNew() {
        this.router.navigate(['/pages/gestion-cobros/trabajadores/pago']);
    }

    public getPagoTrabajadores(params) {
        this.pagoTrabajadorService
            .getPagosTrabajadores(params)
            .pipe(
                tap((response) => {
                    response.data.forEach((items) => {
                        items.fechaCreacion = this.datePipe.transform(
                            items.fechaCreacion,
                            'dd/MM/yyyy'
                        );
                        items.total =
                            params == CodigoCobroTrabajador.PENDIENTES
                                ? items.total - items.totalAbono
                                : items.total;
                        items.total = this.currencyPipe.transform(
                            items.total,
                            'USD',
                            'symbol',
                            '1.2-2'
                        );
                        //items.nombreTrabajador = this.datePipe.transform(items.nombreTrabajador, 'titlecase');
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

    private convertDataExport(data) {
        const convertData = data.map((items) => {
            const mappedItem: any = {
                FechaDeLiquidacion: items.fechaCreacion,
                NúmeroDePago: items.consecutivo,
                Empresa: items.nombreSubempresa,
                Valor: parseCurrency(items.total),
                Estado: items.nombreEstadoCobro,
            };
            return mappedItem;

        });
        this.exportData = convertData;
    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    private listenGrid() {
        const refreshData$ = this.estadoDatosService.stateGrid.asObservable();

        refreshData$.subscribe((state) => {
            if (state) {
                this.getPagoTrabajadores(this.selectedTab);
            }
        });
    }
}
