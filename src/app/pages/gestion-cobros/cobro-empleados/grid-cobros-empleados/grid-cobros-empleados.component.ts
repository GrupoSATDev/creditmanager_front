import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { map, Subscription, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { AsyncPipe, CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { CobroTrabajadoresService } from '../../../../core/services/cobro-trabajadores.service';
import { Estados } from '../../../../core/enums/estados';
import { MatOption } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { EstadoCreditosService } from '../../../../core/services/estado-creditos.service';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

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
        NgIf,
        AsyncPipe,
        ReactiveFormsModule,
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
    private estadoCreditosService = inject(EstadoCreditosService);
    private fb = inject(FormBuilder);
    estados = new FormControl([''])

    public subcription$: Subscription;
    public selectedData: any;
    public searchTerm: string = '';
    public estadoCreditos$ = this.estadoCreditosService.getEstadoCobros().pipe(
        tap((response) => {
            const selectedValue = response.data;
            if (selectedValue) {
                this.estados.setValue(selectedValue[1].id);
                this.cobros(selectedValue[1].id);
            }
        })
    )


    data = [];

    columns = ['Nombre completo', 'Valor proximo a pagar', 'Deuda total', 'Empresa', 'Estado'];

    columnPropertyMap = {
        'Nombre completo': 'nombreTrabajador',
        'Valor proximo a pagar': 'montoProximoPago',
        'Deuda total': 'deudaTotal',
        'Empresa': 'nombreSubEmpresa',
        'Estado': 'nombreEstadoCredito',
    };

    buttons: IButton[] = [
        {
            label: 'Ver',
            icon: 'visibility',
            action: (element) => {
                console.log('Editing', element);
                this.selectedData = element;
                this.router.navigate(['pages/gestion-cobros/cobros/cobro', this.selectedData.idTrabajador])
            }
        },
    ];

    constructor(
        private _matDialog: MatDialog,

    ) {
    }

    onSelect(estado: MatSelectChange) {
        const id = estado.value;
        this.cobros(id);
    }

    private cobros(id) {
        this.subcription$ = this.cobroTrabadorService.getCobrosGrid(id).pipe(
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
                    //items.fechaCobro = this.datePipe.transform(items.fechaCobro, 'dd/MM/yyyy');
                    items.deudaTotal = this.currencyPipe.transform(items.deudaTotal, 'USD', 'symbol', '1.2-2');
                    items.montoProximoPago = this.currencyPipe.transform(items.montoProximoPago, 'USD', 'symbol', '1.2-2');
                    //items.nombreTrabajador = this.datePipe.transform(items.nombreTrabajador, 'titlecase');
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
                //this.getCobros();
            }
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
        this.listenGrid();
    }



}
