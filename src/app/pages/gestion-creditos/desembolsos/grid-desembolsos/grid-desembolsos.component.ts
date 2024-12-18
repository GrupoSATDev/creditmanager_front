import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTab, MatTabChangeEvent, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { CurrencyPipe, DatePipe, NgClass, NgIf } from '@angular/common';
import { map, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CodigosEstadosSolicitudes, EstadosSolicitudes } from '../../../../core/enums/estados-solicitudes';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { MatDialog } from '@angular/material/dialog';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { Estados } from '../../../../core/enums/estados';
import { exportar } from '../../../../core/constant/dialogs';
import * as XLSX from 'xlsx';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { DetalleConsumoService } from '../../../../core/services/detalle-consumo.service';
import { CodigosDesembolso, CodigosDetalleConsumo } from '../../../../core/enums/detalle-consumo';

@Component({
  selector: 'app-grid-desembolsos',
  standalone: true,
    imports: [
        CustomTableComponent,
        FuseAlertComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        MatTab,
        MatTabContent,
        MatTabGroup,
        NgIf,
        NgClass,
    ],
    providers: [
        DatePipe,
        CurrencyPipe
    ],
  templateUrl: './grid-desembolsos.component.html',
  styleUrl: './grid-desembolsos.component.scss'
})
export class GridDesembolsosComponent implements OnInit, OnDestroy {
    public subcription$: Subscription;
    public selectedData: any;
    private datePipe = inject(DatePipe);
    private currencyPipe = inject(CurrencyPipe);
    private router = inject(Router);
    private selectedTab: any = CodigosEstadosSolicitudes.PENDIENTE;
    public tabIndex ;
    private _matDialog = inject(MatDialog);
    private estadoDatosService = inject(EstadosDatosService);
    private solicitudService = inject(SolicitudesService);
    private detalleConsumoService = inject(DetalleConsumoService);
    public fuseService = inject(FuseConfirmationService);
    exportData = [];

    public searchTerm: string = '';

    data = [];

    columns = ['Fecha de solicitud', 'Identificación', 'Trabajador', 'Empresa', 'Cargo', 'Tipo de contrato', 'Fecha de inicio contrato', 'Fecha fin de contrato', 'Salario devengado', 'Cupo solicitado','Tipo de solicitud', 'Tipo de cuenta', 'Número de cuenta', 'Estado'];
    columnPropertyMap = {
        'Fecha de solicitud': 'fechaCreacion',
        'Identificación': 'documentoTrabajador',
        'Trabajador': 'nombreTrabajador',
        'Empresa': 'nombreSubEmpresa',
        'Cargo': 'cargoTrabajador',
        'Tipo de contrato': 'tipoContratoTrabajador',
        'Fecha de inicio contrato': 'fechaInicioContratoTrabajador',
        'Fecha fin de contrato': 'fechaFinContratoTrabajador',
        'Salario devengado': 'salarioDevengadoTrabajador',
        'Cupo solicitado': 'cupo',
        'Tipo de solicitud': 'nombreTipoSolicitud',
        'Tipo de cuenta': 'tipoCuentaTrabajador',
        'Número de cuenta': 'numeroCuentaTrabajador',
        'Estado': 'nombreEstadoSolicitud',
    };

    columnsDesembolsos = ['Fecha de solicitud', 'Identificación', 'Trabajador', 'Empresa', 'Cargo', 'Tipo de contrato', 'Fecha de inicio contrato', 'Fecha fin de contrato', 'Salario devengado', 'Monto consumo', 'Cupo disponible', 'Tipo de consumo', 'Tipo de cuenta', 'Banco', 'Número de cuenta', 'Estado'];
    columnPropertyMapDesembolsos = {
        'Fecha de solicitud': 'fechaCreacion',
        'Identificación': 'documentoTrabajador',
        'Trabajador': 'nombreTrabajador',
        'Empresa': 'nombreSubEmpresa',
        'Cargo': 'cargoTrabajador',
        'Tipo de contrato': 'tipoContratoTrabajador',
        'Fecha de inicio contrato': 'fechaInicioContratoTrabajador',
        'Fecha fin de contrato': 'fechaFinContratoTrabajador',
        'Salario devengado': 'salarioDevengadoTrabajador',
        'Monto consumo': 'montoConsumo',
        'Cupo disponible': 'cupoDisponibleTrabajador',
        'Tipo de consumo': 'tipoConsumo',
        'Tipo de cuenta': 'tipoCuentaTrabajador',
        'Banco': 'bancotrabajador',
        'Número de cuenta': 'numeroCuentaTrabajador',
        'Estado': 'nombreEstadoCredito',
    };

    buttons: IButton[] = [
        {
            label: 'View',
            icon: 'visibility',
            action: (element) => {
                console.log('Approve', element);
                this.selectedData = element;
                this.router.navigate(['pages/gestion-creditos/solicitudes/estados', this.selectedData.id])

            }
        },
    ];

    buttonsApprove: IButton[] = [
        {
            label: 'View',
            icon: 'visibility',
            action: (element) => {
                console.log('Approve', element);
                this.selectedData = element;
                this.router.navigate(['pages/gestion-creditos/desembolsos/registrar', this.selectedData.id])

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
                this.router.navigate(['pages/gestion-creditos/desembolsos/view', this.selectedData.id])

            }
        },
    ];

    buttonsPendiente: IButton[] = [
        {
            label: 'View',
            icon: 'visibility',
            action: (element) => {
                console.log('Approve', element);
                this.selectedData = element;
                this.router.navigate(['pages/gestion-creditos/desembolsos/desembolso', this.selectedData.id])

            }
        },
    ];

    getSolicitudes(param): void {
            this.subcription$ = this.solicitudService.getSolicitudesDesembolso(param).pipe(
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
                        items.fechaInicioContratoTrabajador = this.datePipe.transform(items.fechaInicioContratoTrabajador, 'dd/MM/yyyy');
                        items.fechaFinContratoTrabajador = this.datePipe.transform(items.fechaFinContratoTrabajador, 'dd/MM/yyyy');
                        items.cupo = this.currencyPipe.transform(items.cupo, 'USD', 'symbol', '1.2-2');
                        items.salarioDevengadoTrabajador = this.currencyPipe.transform(items.salarioDevengadoTrabajador, 'USD', 'symbol', '1.2-2');
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

    getDesembolsos(param) {
        this.subcription$ = this.detalleConsumoService.getDetallesConsumoDesembolsos(param).pipe(
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
                    items.fechaInicioContratoTrabajador = this.datePipe.transform(items.fechaInicioContratoTrabajador, 'dd/MM/yyyy');
                    items.fechaFinContratoTrabajador = this.datePipe.transform(items.fechaFinContratoTrabajador, 'dd/MM/yyyy');
                    items.salarioDevengadoTrabajador = this.currencyPipe.transform(items.salarioDevengadoTrabajador, 'USD', 'symbol', '1.2-2');
                    items.montoConsumo = this.currencyPipe.transform(items.montoConsumo, 'USD', 'symbol', '1.2-2');
                    items.cupoDisponibleTrabajador = this.currencyPipe.transform(items.cupoDisponibleTrabajador, 'USD', 'symbol', '1.2-2');
                })
                return response;
            })
        ).subscribe((response) => {
            if (response) {
                this.data = response.data;
            }else {
                this.data = [];
            }
        }, error => {
            this.data = [];
        })
    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    private convertDataExport(data, ) {
        const convertData = data.map((items) => {
            return {
                FechaSolicitud : items.fechaCreacion,
                Identificacion : items.documentoTrabajador,
                Trabajador : items.nombreTrabajador,
                Empresa : items.nombreSubEmpresa,
                Cargo : items.cargoTrabajador,
                Contrato : items.tipoContratoTrabajador,
                FechaInicioContrato : items.fechaInicioContratoTrabajador,
                FechaFinContrato : items.fechaFinContratoTrabajador,
                SalarioDevengado : items.salarioDevengadoTrabajador,
                CupoSolicitado : items.cupo,
                TipoSolicitud : items.nombreTipoSolicitud,
                TipoCuenta : items.tipoCuentaTrabajador,
                NumeroCuenta : items.numeroCuentaTrabajador,
                Estado : items.nombreEstadoSolicitud,
            };
        });
        this.exportData = convertData;
    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngOnInit(): void {
        this.getSolicitudes(this.selectedTab);
        this.listenGrid();
    }

    private listenGrid() {
        const refreshData$ = this.estadoDatosService.stateGridSolicitudes.asObservable();

        refreshData$.subscribe((states) => {
            if (states.state) {
                console.log('Si entro')
                console.log(states)
                this.selectedTab =
                    states.tab == 0 ? CodigosEstadosSolicitudes.PENDIENTE :
                    states.tab == 1 ? EstadosSolicitudes.RECHAZADA :
                    states.tab == 2 ? EstadosSolicitudes.APROBADA :
                    states.tab == 3 ? EstadosSolicitudes.REALIZADA_DESEMBOLSO : EstadosSolicitudes.APROBADA;
                this.tabIndex = states.tab;

            }
        })

    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        this.tabIndex = tabChangeEvent.index;
        this.selectedTab = tabChangeEvent.index == 0 ? CodigosEstadosSolicitudes.PENDIENTE :
                           tabChangeEvent.index == 1 ? CodigosDesembolso.RECHAZADA :
                           tabChangeEvent.index == 2 ? CodigosDesembolso.APROBADA :
                           tabChangeEvent.index == 3 ? CodigosDesembolso.REALIZADA :
                           EstadosSolicitudes.APROBADA
        if ([CodigosEstadosSolicitudes.PENDIENTE].includes(this.selectedTab)) {
            this.getSolicitudes(this.selectedTab)
        } else if([CodigosDesembolso.RECHAZADA, CodigosDesembolso.APROBADA, CodigosDesembolso.REALIZADA].includes(this.selectedTab)) {
            this.getDesembolsos(this.selectedTab)
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
                XLSX.writeFile(workbook, `Desembolsos${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.xlsx`);
            }
        })

    }

}
