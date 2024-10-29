import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Subscription, tap } from 'rxjs';
import { PagoTrabajadoresService } from '../../../../core/services/pago-trabajadores.service';
import { MatDialog } from '@angular/material/dialog';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { Router } from '@angular/router';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';

@Component({
  selector: 'app-grid-pago-trabajador',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
    ],
    providers: [
        DatePipe,
        CurrencyPipe
    ],
  templateUrl: './grid-pago-trabajador.component.html',
  styleUrl: './grid-pago-trabajador.component.scss'
})
export class GridPagoTrabajadorComponent implements OnInit, OnDestroy {
    private datePipe = inject(DatePipe);
    public subcription$: Subscription;
    public selectedData: any;
    private currencyPipe = inject(CurrencyPipe);

    private pagoTrabajadorService = inject(PagoTrabajadoresService);
    private _matDialog = inject(MatDialog);
    private estadoDatosService = inject(EstadosDatosService)
    private router = inject(Router);

    data = [];

    columns = ['Creación', 'Empresa', 'Total', ];
    columnPropertyMap = {
        'Creación': 'fechaCreacion',
        'Empresa': 'nombreSubempresa',
        'Total': 'total'
    };

    buttons: IButton[] = [
        {
            label: 'Eye',
            icon: 'visibility',
            action: (element) => {
                console.log('Editing', element);
                this.router.navigate(['/pages/gestion-cobros/trabajador/individual/', element.id])
            }
        },
    ];

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.getPagoTrabajadores();
        this.listenGrid();
    }

    onNew() {
        this.router.navigate(['/pages/gestion-cobros/trabajador/individual'])
    }

    public getPagoTrabajadores() {
        this.pagoTrabajadorService.getPagosTrabajadores().pipe(
            tap((response) => {
                response.data.forEach((items) => {
                    items.fechaCreacion = this.datePipe.transform(items.fechaCreacion, 'dd/MM/yyyy');
                    items.total = this.currencyPipe.transform(items.total, 'USD', 'symbol', '1.2-2');
                    //items.nombreTrabajador = this.datePipe.transform(items.nombreTrabajador, 'titlecase');
                })
                return response;
            })

        ).subscribe((response) => {

            this.data = response.data;

        })
    }



    private listenGrid() {
        const refreshData$ = this.estadoDatosService.stateGrid.asObservable();

        refreshData$.subscribe((state) => {
            if (state) {
                this.getPagoTrabajadores();
            }
        })

    }

}
