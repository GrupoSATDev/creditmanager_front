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
import { EstadosSolicitudes } from '../../../../core/enums/estados-solicitudes';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { MatDialog } from '@angular/material/dialog';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { Estados } from '../../../../core/enums/estados';
import { exportar } from '../../../../core/constant/dialogs';
import * as XLSX from 'xlsx';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';

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
    private selectedTab: any = EstadosSolicitudes.PENDIENTE_DESEMBOLSO;
    public tabIndex ;
    private _matDialog = inject(MatDialog);
    private estadoDatosService = inject(EstadosDatosService);
    private solicitudService = inject(SolicitudesService);
    public fuseService = inject(FuseConfirmationService);

    public searchTerm: string = '';

    data = [];

    columns = ['Fecha de solicitud','Trabajador','Cupo solicitado', 'Empresa', 'Estado'];
    columnPropertyMap = {
        'Fecha de solicitud': 'fechaCreacion',
        'Trabajador': 'nombreTrabajador',
        'Cupo solicitado': 'cupo',
        'Empresa': 'nombreSubEmpresa',
        'Estado': 'nombreEstadoSolicitud',
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
                this.router.navigate(['pages/gestion-creditos/desembolsos/desembolso', this.selectedData.id])

            }
        },
    ];

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

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
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
                    states.tab == 0 ? EstadosSolicitudes.PENDIENTE :
                    states.tab == 1 ? EstadosSolicitudes.RECHAZADA :
                    states.tab == 2 ? EstadosSolicitudes.APROBADA :
                    states.tab == 3 ? EstadosSolicitudes.REALIZADA_DESEMBOLSO : EstadosSolicitudes.APROBADA;
                this.tabIndex = states.tab;
                console.log(this.tabIndex)
                this.getSolicitudes(this.selectedTab);
            }
        })

    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        console.log('tabChangeEvent => ', tabChangeEvent);
        console.log('index => ', tabChangeEvent.index);
        this.tabIndex = tabChangeEvent.index;
        console.log(this.tabIndex)
        this.selectedTab = tabChangeEvent.index == 0 ? EstadosSolicitudes.PENDIENTE_DESEMBOLSO :
                           tabChangeEvent.index == 1 ? EstadosSolicitudes.RECHAZADA_DESEMBOLSO :
                           tabChangeEvent.index == 2 ? EstadosSolicitudes.APROBADO_DESEMBOLSO :
                           tabChangeEvent.index == 3 ? EstadosSolicitudes.REALIZADA_DESEMBOLSO :
                           EstadosSolicitudes.APROBADA
        this.getSolicitudes(this.selectedTab)
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
