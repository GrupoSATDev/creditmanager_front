import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { map, Subscription } from 'rxjs';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { MatDialog } from '@angular/material/dialog';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';

import { FormSolicitudesComponent } from '../form-solicitudes/form-solicitudes.component';
import { Estados } from '../../../../core/enums/estados';
import { FormApproveComponent } from '../form-approve/form-approve.component';
import { CurrencyPipe, DatePipe, NgClass, NgIf } from '@angular/common';
import { MatTab, MatTabChangeEvent, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { EstadosSolicitudes } from '../../../../core/enums/estados-solicitudes';
import { Router } from '@angular/router';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { exportar } from '../../../../core/constant/dialogs';
import * as XLSX from 'xlsx';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';

@Component({
  selector: 'app-grid-solicitudes',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        MatTab,
        MatTabGroup,
        MatTabContent,
        NgIf,
        FuseAlertComponent,
        NgClass,
    ],
    providers: [
        DatePipe,
        CurrencyPipe
    ],
  templateUrl: './grid-solicitudes.component.html',
  styleUrl: './grid-solicitudes.component.scss'
})
export class GridSolicitudesComponent implements OnInit, OnDestroy{

    public subcription$: Subscription;
    public selectedData: any;
    private datePipe = inject(DatePipe);
    private currencyPipe = inject(CurrencyPipe);
    public fuseService = inject(FuseConfirmationService);
    private router = inject(Router);
    private selectedTab: any = EstadosSolicitudes.PENDIENTE;
    public tabIndex ;
    public searchTerm: string = '';

    data = [];

    columns = ['Fecha de solicitud','Trabajador','Cupo solicitado', 'Empresa', 'Tipo de solicitud'];
    columnPropertyMap = {
        'Fecha de solicitud': 'fechaCreacion',
        'Trabajador': 'nombreTrabajador',
        'Cupo solicitado': 'cupo',
        'Empresa': 'nombreSubEmpresa',
        'Tipo de solicitud': 'nombreTipoSolicitud',
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

    constructor(
        private _matDialog: MatDialog,
        private estadoDatosService: EstadosDatosService,
        private solicitudService: SolicitudesService
    ) {
    }

    onNew() {
        this._matDialog.open(FormSolicitudesComponent, {
            autoFocus: false,
            data: {
                edit: false,
            },
            maxHeight: '95vh',
            maxWidth: '100%',
            disableClose: true
        })
    }

    getSolicitudes(param): void {

        this.subcription$ = this.solicitudService.getSolicitudes(param).pipe(
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
                    items.cupo = this.currencyPipe.transform(items.cupo, 'USD', 'symbol', '1.2-2');
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

    private listenGrid() {
        const refreshData$ = this.estadoDatosService.stateGridSolicitudes.asObservable();

        refreshData$.subscribe((states) => {
            if (states.state) {
                console.log('Si entro')
                console.log(states)
                this.selectedTab = states.tab == 0 ? EstadosSolicitudes.PENDIENTE :
                                    states.tab == 1 ? EstadosSolicitudes.RECHAZADA :
                                    states.tab == 2 ? EstadosSolicitudes.APROBADA :
                                    states.tab == 3 ? EstadosSolicitudes.PENDIENTE_DESEMBOLSO :
                                    EstadosSolicitudes.APROBADA;
                this.tabIndex = states.tab;
                console.log(this.tabIndex)
                this.getSolicitudes(this.selectedTab);
            }
        })

    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        console.log('tabChangeEvent => ', tabChangeEvent);
        console.log('index => ', tabChangeEvent.index);
        this.tabIndex = tabChangeEvent.index;
        console.log(this.tabIndex)
        this.selectedTab = tabChangeEvent.index == 0 ? EstadosSolicitudes.PENDIENTE :
                           tabChangeEvent.index == 1 ? EstadosSolicitudes.RECHAZADA :
                           tabChangeEvent.index == 2 ? EstadosSolicitudes.APROBADA : EstadosSolicitudes.PENDIENTE
        this.getSolicitudes(this.selectedTab)
    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngOnInit(): void {
        this.getSolicitudes(this.selectedTab);
        this.listenGrid();
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
                XLSX.writeFile(workbook, 'exported_data.xlsx');
            }
        })

    }



}
