import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { map, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { CurrencyPipe, DatePipe, NgForOf } from '@angular/common';
import { Router } from '@angular/router';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { CobroTrabajadoresService } from '../../../../core/services/cobro-trabajadores.service';
import { Estados } from '../../../../core/enums/estados';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-grid-cobros-empleados',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        NgForOf,
    ],
    providers: [
        DatePipe,
        CurrencyPipe
    ],
  templateUrl: './grid-cobros-empleados.component.html',
  styleUrl: './grid-cobros-empleados.component.scss'
})
export class GridCobrosEmpleadosComponent implements OnInit, OnDestroy{
    private datePipe = inject(DatePipe);
    private router = inject(Router);
    private estadoDatosService: EstadosDatosService = inject(EstadosDatosService);
    private currencyPipe = inject(CurrencyPipe);
    private cobroTrabadorService = inject(CobroTrabajadoresService);

    public subcription$: Subscription;
    public selectedData: any;
    public searchTerm: string = '';


    data = [];

    columns = ['Fecha cuota', 'Valor cuota', 'Valor pagado', 'Estado'];

    columnPropertyMap = {
        'Fecha cuota': 'fechaCobro',
        'Valor cuota': 'valorPendiente',
        'Valor pagado': 'valorPago',
        'Estado': 'nombreEstadoCredito',
    };

    buttons: IButton[] = [
        {
            label: 'View',
            icon: 'visibility',
            action: (element) => {
                console.log('Editing', element);
                this.selectedData = element;
            }
        },
    ];

    constructor(
        private _matDialog: MatDialog,

    ) {
    }

    getCobros() {
        this.subcription$ = this.cobroTrabadorService.getCobros().pipe(
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
                    items.fechaCobro = this.datePipe.transform(items.fechaCobro, 'dd/MM/yyyy');
                    items.valorPendiente = this.currencyPipe.transform(items.valorPendiente, 'USD', 'symbol', '1.2-2');
                    items.valorPago = items.valorPago ? this.currencyPipe.transform(items.valorPago, 'USD', 'symbol', '1.2-2') : '-';
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
        const refreshData$ = this.estadoDatosService.stateGrid.asObservable();
        refreshData$.subscribe((state) => {
            if (state) {
                this.getCobros();
            }
        })
    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngOnInit(): void {
        this.getCobros();
        this.listenGrid();
    }



}
