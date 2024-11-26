import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTab, MatTabChangeEvent, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { map, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { EstadoDetalleConsumo } from '../../../../core/enums/detalle-consumo';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { DetalleConsumoService } from '../../../../core/services/detalle-consumo.service';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';

@Component({
  selector: 'app-grid-consumos',
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
  templateUrl: './grid-consumos.component.html',
  styleUrl: './grid-consumos.component.scss'
})
export class GridConsumosComponent implements OnInit, OnDestroy{
    public subcription$: Subscription;
    public selectedData: any;
    private datePipe = inject(DatePipe);
    private currencyPipe = inject(CurrencyPipe);
    private router = inject(Router);
    private estadoService: EstadosDatosService = inject(EstadosDatosService);
    private consumoService = inject(DetalleConsumoService);
    private selectedTab: any = EstadoDetalleConsumo.EN_REVISION;
    public tabIndex ;
    public searchTerm: string = '';

    data = [];

    columns = ['Fecha','Número de factura', 'Detalle compra', 'Valor factura', 'Valor cuotas', 'Cantidad cuotas', 'Estado'];
    columnPropertyMap = {
        'Fecha': 'fechaCreacion',
        'Número de factura': 'numeroFactura',
        'Detalle compra': 'detalleCompra',
        'Valor factura': 'montoConsumo',
        'Valor cuotas': 'montoCuotas',
        'Cantidad cuotas': 'cantidadCuotas',
        'Estado': 'nombreEstadoCredito',
    };

    buttons: IButton[] = [
        {
            label: 'View',
            icon: 'visibility',
            action: (element) => {
                console.log('Approve', element);
                this.selectedData = element;
                this.router.navigate(['pages/gestion-creditos/consumos/detalle', this.selectedData.id])

            }
        },
    ];

    private listenGrid() {
        const refreshData$ = this.estadoService.stateGridSolicitudes.asObservable();

        refreshData$.subscribe((states) => {
            if (states.state) {
                console.log('Si entro')
                console.log(states)
                this.selectedTab = states.tab == 0 ? EstadoDetalleConsumo.EN_REVISION :
                                   states.tab == 1 ? EstadoDetalleConsumo.APROBADA :
                                   //states.tab == 2 ? EstadoDetalleConsumo.PAGADO :
                                   states.tab == 2 ? EstadoDetalleConsumo.RECHAZADA : EstadoDetalleConsumo.EN_REVISION;
                this.tabIndex = states.tab;
                console.log(this.tabIndex)
                this.getDetalle(this.selectedTab);
            }
        })

    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        console.log('tabChangeEvent => ', tabChangeEvent);
        console.log('index => ', tabChangeEvent.index);
        this.tabIndex = tabChangeEvent.index;
        console.log(this.tabIndex)
        this.selectedTab = tabChangeEvent.index == 0 ? EstadoDetalleConsumo.EN_REVISION :
                           tabChangeEvent.index == 1 ? EstadoDetalleConsumo.APROBADA :
                           //tabChangeEvent.index == 2 ? EstadoDetalleConsumo.PAGADO :
                           tabChangeEvent.index == 2 ? EstadoDetalleConsumo.RECHAZADA : EstadoDetalleConsumo.EN_REVISION;
        this.getDetalle(this.selectedTab);

    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    getDetalle(param): void {

        this.subcription$ = this.consumoService.getDetalle(param).pipe(
            map((response) => {
                response.data.forEach((items) => {
                    items.fechaCreacion = this.datePipe.transform(items.fechaCreacion, 'dd/MM/yyyy');
                    items.montoConsumo = this.currencyPipe.transform(items.montoConsumo, 'USD', 'symbol', '1.2-2');
                    items.montoCuotas = this.currencyPipe.transform(items.montoCuotas, 'USD', 'symbol', '1.2-2');
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

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngOnInit(): void {
        this.getDetalle(this.selectedTab);
        this.listenGrid();
    }

}
