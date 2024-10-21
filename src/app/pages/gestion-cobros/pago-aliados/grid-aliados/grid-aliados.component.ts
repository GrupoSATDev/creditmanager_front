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

    data = [];

    columns = ['Creación', 'Empresa', 'Total', ];
    columnPropertyMap = {
        'Creación': 'fechaCreacion',
        'Empresa': 'nombreSubempresa',
        'Total': 'total'
    };

    buttons: IButton[] = [
        {
            label: 'Edit',
            icon: 'edit',
            action: (element) => {
                console.log('Editing', element);
                this.selectedData = element;
            }
        },
    ];

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.getAliados();
    }

    onNew() {
        this._matDialog.open(FormAliadosComponent, {
            autoFocus: false,
            data: {
                edit: false,
            },
            maxHeight: '90vh',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        });

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

}
