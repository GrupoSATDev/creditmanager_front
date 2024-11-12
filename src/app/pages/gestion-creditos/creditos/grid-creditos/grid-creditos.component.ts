import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { map, Subscription } from 'rxjs';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { CreditosService } from '../../../../core/services/creditos.service';
import { Estados } from '../../../../core/enums/estados';
import { MatTab, MatTabChangeEvent, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { EstadosSolicitudes } from '../../../../core/enums/estados-solicitudes';
import { EstadosCreditos } from '../../../../core/enums/estados-creditos';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';

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
    public searchTerm: string = '';

    data = [];

    columns = ['Fecha de solicitud', 'Solicitante','Cupo solicitado', 'Empresa', 'Estado',];
    columnsAprobadas = ['Fecha de aprobación', 'Solicitante','Cupo aprobado', 'Empresa', 'Estado',];

    columnPropertyMap = {
        'Fecha de solicitud': 'fechaCreacion',
        'Solicitante': 'nombreTrabajador',
        'Cupo solicitado': 'cupoSolicitado',
        'Empresa': 'nombreEmpresaMaestra',
        'Estado': 'nombreEstadoCredito',
    };

    columnPropertyAprobadas = {
        'Fecha de aprobación': 'fechaAprobacion',
        'Solicitante': 'nombreTrabajador',
        'Cupo aprobado': 'cupoAprobado',
        'Empresa': 'nombreEmpresaMaestra',
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

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        console.log('tabChangeEvent => ', tabChangeEvent);
        console.log('index => ', tabChangeEvent.index);
        this.selectedTab =
            tabChangeEvent.index == 0 ? EstadosCreditos.EN_REVISION :
            tabChangeEvent.index == 1 ? EstadosCreditos.APROBADO :
            tabChangeEvent.index == 2 ? EstadosCreditos.VENCIDO :
            tabChangeEvent.index == 3 ? EstadosCreditos.BLOQUEADO : EstadosCreditos.EN_REVISION;
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
                    items.fechaAprobacion = this.datePipe.transform(items.fechaAprobacion, 'dd/MM/yyyy');
                    items.cupoAprobado = this.currencyPipe.transform(items.cupoAprobado, 'USD', 'symbol', '1.2-2');
                    items.cupoSolicitado = this.currencyPipe.transform(items.cupoSolicitado, 'USD', 'symbol', '1.2-2');
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

    private listenGrid() {
        const refreshData$ = this.estadoDatosService.stateGrid.asObservable();

        refreshData$.subscribe((state) => {
            if (state) {
                this.getCreditos(this.selectedTab);
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
