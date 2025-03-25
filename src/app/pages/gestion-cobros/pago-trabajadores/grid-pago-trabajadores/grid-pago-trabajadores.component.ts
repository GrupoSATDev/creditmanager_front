import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
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
    ],
    providers: [
        DatePipe,
        CurrencyPipe
    ],
  templateUrl: './grid-pago-trabajadores.component.html',
  styleUrl: './grid-pago-trabajadores.component.scss'
})
export class GridPagoTrabajadoresComponent implements OnInit, OnDestroy{
    private datePipe = inject(DatePipe);
    public subcription$: Subscription;
    public selectedData: any;
    public searchTerm: string = '';
    private currencyPipe = inject(CurrencyPipe);

    private pagoTrabajadorService = inject(PagoTrabajadoresService);
    private _matDialog = inject(MatDialog);
    private estadoDatosService = inject(EstadosDatosService)
    private router = inject(Router);
    private selectedTab: any = CodigoCobroTrabajador.PENDIENTES;
    public tabIndex ;

    data = [];

    columns = ['Fecha de liquidación', 'Empresa', 'Valor', 'Estado' ];
    columnPropertyMap = {
        'Fecha de liquidación': 'fechaCreacion',
        'Empresa': 'nombreSubempresa',
        'Valor': 'total',
        'Estado': 'nombreEstadoCobro',
    };

    buttons: IButton[] = [
        {
            label: 'Ver',
            icon: 'visibility',
            action: (element) => {
                console.log('Editing', element);
                this.router.navigate(['/pages/gestion-cobros/trabajadores/pago/', element.id])
            }
        },
        {
            label: 'Cambiar estado',
            icon: 'published_with_changes',
            action: (element) => {
                console.log('View', element);
                this.selectedData = element;
                this.onCambioEstado();
            }
        },
        {
            label: 'Abonos',
            icon: 'request_quote',
            action: (element) => {
                console.log('View', element);
                this.selectedData = element;
                this.onAbono();
            }
        },
        {
            label: 'Comprobante',
            icon: 'document_scanner',
            action: (element) => {
                console.log('Editing', element);
                this.router.navigate(['/pages/gestion-cobros/trabajador/individual/', element.id])
            }
        },
    ];

    buttonsPagado: IButton[] = [
        {
            label: 'Ver',
            icon: 'visibility',
            action: (element) => {
                console.log('Editing', element);
                this.router.navigate(['/pages/gestion-cobros/trabajadores/pago/', element.id])
            }
        },
        {
            label: 'Comprobante',
            icon: 'document_scanner',
            action: (element) => {
                console.log('Editing', element);
                this.router.navigate(['/pages/gestion-cobros/trabajador/individual/', element.id])
            }
        },
    ];

    onCambioEstado(): void {
        this._matDialog.open(DialogEstadoMasivoComponent, {
            autoFocus: false,
            data: {
                edit: true,
                data: this.selectedData
            },
            width: '35%',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        })
    }

    onAbono(): void {
        this._matDialog.open(DialogAbonosMasivosComponent, {
            autoFocus: false,
            data: {
                edit: true,
                data: this.selectedData
            },
            width: '35%',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        })
    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        this.tabIndex = tabChangeEvent.index;
        this.selectedTab = tabChangeEvent.index == 0 ? CodigoCobroTrabajador.PENDIENTES : CodigoCobroTrabajador.PAGADOS;
        this.getPagoTrabajadores(this.selectedTab);
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.getPagoTrabajadores(this.selectedTab);
        this.listenGrid();
    }

    onNew() {
        this.router.navigate(['/pages/gestion-cobros/trabajadores/pago'])
    }

    public getPagoTrabajadores(params) {
        this.pagoTrabajadorService.getPagosTrabajadores(params).pipe(
            tap((response) => {
                response.data.forEach((items) => {
                    items.fechaCreacion = this.datePipe.transform(items.fechaCreacion, 'dd/MM/yyyy');
                    items.total = items.total - items.totalAbono;
                    items.total = this.currencyPipe.transform(items.total, 'USD', 'symbol', '1.2-2');
                    //items.nombreTrabajador = this.datePipe.transform(items.nombreTrabajador, 'titlecase');
                })
                return response;
            })

        ).subscribe((response) => {

            this.data = response.data;

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
                this.getPagoTrabajadores(this.selectedTab);
            }
        })

    }

}
