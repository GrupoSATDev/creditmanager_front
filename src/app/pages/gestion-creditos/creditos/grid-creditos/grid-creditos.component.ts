import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { map, Subscription } from 'rxjs';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe, NgClass, NgIf } from '@angular/common';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { CreditosService } from '../../../../core/services/creditos.service';
import { Estados } from '../../../../core/enums/estados';
import { MatTab, MatTabChangeEvent, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { EstadosSolicitudes } from '../../../../core/enums/estados-solicitudes';
import { EstadosCreditos } from '../../../../core/enums/estados-creditos';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import * as XLSX from 'xlsx';
import { exportar, guardar } from '../../../../core/constant/dialogs';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';

@Component({
  selector: 'app-grid-creditos',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        MatTab,
        MatTabContent,
        MatTabGroup,
        NgIf,
        FuseAlertComponent,
        NgClass,
    ],
    providers: [
        DatePipe,
        CurrencyPipe
    ],
  templateUrl: './grid-creditos.component.html',
  styleUrl: './grid-creditos.component.scss'
})
export class GridCreditosComponent implements OnInit, OnDestroy {
    public subcription$: Subscription;
    public selectedData: any;
    private datePipe = inject(DatePipe);
    private router = inject(Router);
    private estadoDatosService: EstadosDatosService = inject(EstadosDatosService);
    private creditoService: CreditosService = inject(CreditosService);
    private selectedTab: any = EstadosCreditos.EN_REVISION;
    private currencyPipe = inject(CurrencyPipe);
    public fuseService = inject(FuseConfirmationService);
    public searchTerm: string = '';

    data = [];
    exportData = [];

    columns = ['Fecha de solicitud', 'Identificación', 'Solicitante', 'Número de crédito', 'Cupo solicitado', 'Empresa', 'Estado',];
    columnsAprobadas = ['Fecha de aprobación', 'Identificación', 'Solicitante', 'Número de crédito', 'Cupo aprobado', 'Empresa', 'Tasa de interes díaria', 'Fecha de vencimiento', 'Fecha de corte', 'Fecha limite', 'Cupo utilizado', 'Saldo disponible', 'Estado',];

    columnPropertyMap = {
        'Fecha de solicitud': 'fechaCreacion',
        'Identificación': 'docTrabajador',
        'Solicitante': 'nombreTrabajador',
        'Número de crédito': 'numCredito',
        'Cupo solicitado': 'cupoSolicitado',
        'Empresa': 'nombreSubEmpresa',
        'Estado': 'nombreEstadoCredito',
    };

    columnPropertyAprobadas = {
        'Fecha de aprobación': 'fechaAprobacion',
        'Identificación': 'docTrabajador',
        'Solicitante': 'nombreTrabajador',
        'Número de crédito': 'numCredito',
        'Cupo aprobado': 'cupoAprobado',
        'Empresa': 'nombreSubEmpresa',
        'Tasa de interes díaria': 'porcTasaInteres',
        'Fecha de vencimiento': 'fechaVencimiento',
        'Fecha de corte': 'fechaCorte',
        'Fecha limite': 'fechaLimitePago',
        'Cupo utilizado': 'cupoConsumido',
        'Saldo disponible': 'cupoDisponible',
        'Estado': 'nombreEstadoCredito',
    };

    buttons: IButton[] = [
        {
            label: 'View',
            icon: 'visibility',
            action: (element) => {
                console.log('Approve', element);
                this.selectedData = element;
                this.router.navigate(['pages/gestion-creditos/creditos/detalle', this.selectedData.id])
            }
        },
    ];

    buttonsView: IButton[] = [
        {
            label: 'View',
            icon: 'visibility',
            action: (element) => {
                console.log('Approve', element);
                this.selectedData = element;
                this.router.navigate(['pages/gestion-creditos/creditos/view-detalle', this.selectedData.id])
            }
        },
    ];

    buttonsViewRechazado: IButton[] = [
        {
            label: 'View',
            icon: 'visibility',
            action: (element) => {
                console.log('Approve', element);
                this.selectedData = element;
                this.router.navigate(['pages/gestion-creditos/creditos/view-rechazado', this.selectedData.id])
            }
        },
    ];

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        console.log('tabChangeEvent => ', tabChangeEvent);
        console.log('index => ', tabChangeEvent.index);
        this.selectedTab =
            tabChangeEvent.index == 0 ? EstadosCreditos.EN_REVISION :
            tabChangeEvent.index == 1 ? EstadosCreditos.APROBADO :
            tabChangeEvent.index == 2 ? EstadosCreditos.VENCIDO :
            tabChangeEvent.index == 3 ? EstadosCreditos.BLOQUEADO :
            tabChangeEvent.index == 4 ? EstadosCreditos.RECHAZADO : EstadosCreditos.EN_REVISION;
            this.getCreditos(this.selectedTab);

    }

    getCreditos(params) {
        this.subcription$ = this.creditoService.getCreditos(params).pipe(
            map((response) => {
                response.data.forEach((items) => {
                    if (items.estado) {
                        items.estado = Estados.ACTIVO;
                    }else {
                        items.estado = Estados.INACTIVO;
                    }
                })
                return response;

            }),
            map((response) => {
                response.data.forEach((items) => {
                    items.fechaCreacion = this.datePipe.transform(items.fechaCreacion, 'dd/MM/yyyy');
                    items.fechaCorte = this.datePipe.transform(items.fechaCorte, 'dd/MM/yyyy');
                    items.fechaLimitePago = this.datePipe.transform(items.fechaLimitePago, 'dd/MM/yyyy');
                    items.fechaVencimiento = this.datePipe.transform(items.fechaVencimiento, 'dd/MM/yyyy');
                    items.fechaAprobacion = this.datePipe.transform(items.fechaAprobacion, 'dd/MM/yyyy');
                    items.cupoAprobado = this.currencyPipe.transform(items.cupoAprobado, 'USD', 'symbol', '1.2-2');
                    items.cupoSolicitado = this.currencyPipe.transform(items.cupoSolicitado, 'USD', 'symbol', '1.2-2');
                    items.cupoConsumido = this.currencyPipe.transform(items.cupoConsumido, 'USD', 'symbol', '1.2-2');
                    items.cupoDisponible = this.currencyPipe.transform(items.cupoDisponible, 'USD', 'symbol', '1.2-2');
                    items.porcTasaInteres = this.currencyPipe.transform(items.porcTasaInteres, 'percent', '%', '1.2-3');
                })
                return response;
            })
        ).subscribe((response) => {
            if (response) {
                this.data = response.data;
                this.convertDataExport(response.data)
            }else {
                this.data = [];
            }
        }, error => {
            this.data = [];
        })
    }

    private convertDataExport(data, ) {
        if (![EstadosCreditos.EN_REVISION].includes(this.selectedTab) ) {
            const convertData = data.map((items) => {
                return {
                    FechaAprobacion : items.fechaAprobacion,
                    Identificación : items.docTrabajador,
                    Solicitante : items.nombreTrabajador,
                    Númerodecrédito : items.numCredito,
                    Cupoaprobado : items.cupoAprobado,
                    Empresa : items.nombreSubEmpresa,
                    Tasadeinteresdíaria : items.porcTasaInteres,
                    Fechadevencimiento : items.fechaVencimiento,
                    Fechadecorte : items.fechaCorte,
                    Fechalimite : items.fechaLimitePago,
                    Cupoutilizado : items.cupoConsumido,
                    Saldodisponible : items.cupoDisponible,
                    Estado : items.nombreEstadoCredito,
                };
            });
            this.exportData = convertData;
        }else {
            const convertData = data.map((items) => {
                return {
                    Fechadesolicitud : items.fechaCreacion,
                    Identificación : items.docTrabajador,
                    Solicitante : items.nombreTrabajador,
                    Númerodecrédito : items.numCredito,
                    Cuposolicitado : items.cupoSolicitado,
                    Empresa : items.nombreSubEmpresa,
                    Tasadeinteresdíaria : items.porcTasaInteres,
                    Estado : items.nombreEstadoCredito,
                };
            });
            this.exportData = convertData;
        }
    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    private listenGrid() {
        const refreshData$ = this.estadoDatosService.stateGrid.asObservable();

        refreshData$.subscribe((state) => {
            if (state) {
                this.getCreditos(this.selectedTab);
            }
        })

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
                XLSX.writeFile(workbook, `Créditos${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.xlsx`);
            }
        })

    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngOnInit(): void {
        this.getCreditos(this.selectedTab);
        this.listenGrid();
    }

}
