import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { Subscription, tap } from 'rxjs';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { PagoAliadosService } from '../../../../core/services/pago-aliados.service';
import { MatDialog } from '@angular/material/dialog';
import { FormAliadosComponent } from '../form-aliados/form-aliados.component';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid-aliados',
  standalone: true,
    imports: [
        AsyncPipe,
        CustomTableComponent,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        NgForOf,
        NgIf,
        MatButton,
    ],
  templateUrl: './grid-aliados.component.html',
  styleUrl: './grid-aliados.component.scss',
    providers: [
        DatePipe,
        CurrencyPipe
    ],
})
export class GridAliadosComponent implements OnInit, OnDestroy{
    private datePipe = inject(DatePipe);
    public subcription$: Subscription;
    public selectedData: any;
    private currencyPipe = inject(CurrencyPipe);

    private pagoAliadoService = inject(PagoAliadosService);
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
                this.router.navigate(['/pages/gestion-cobros/aliados/detalle/', element.id])
            }
        },
    ];

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.getAliados();
        this.listenGrid();
    }

    onNew() {
        this.router.navigate(['/pages/gestion-cobros/aliados/aliado'])
    }

    public getAliados() {
        this.pagoAliadoService.getAliados().pipe(
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
                this.getAliados();
            }
        })

    }

}
