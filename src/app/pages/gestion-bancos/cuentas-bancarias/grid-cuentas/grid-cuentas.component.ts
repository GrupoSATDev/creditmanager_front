import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { map, Subscription } from 'rxjs';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { MatDialog } from '@angular/material/dialog';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';

import { FormCuentasComponent } from '../form-cuentas/form-cuentas.component';
import { Estados } from '../../../../core/enums/estados';
import { CuentasBancariasService } from '../../../../core/services/cuentas-bancarias.service';

@Component({
  selector: 'app-grid-cuentas',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
    ],
  templateUrl: './grid-cuentas.component.html',
  styleUrl: './grid-cuentas.component.scss'
})
export class GridCuentasComponent implements OnInit, OnDestroy{

    public subcription$: Subscription;
    public selectedData: any;
    public searchTerm: string = '';

    data = [];

    columns = ['Número de cuenta', 'Tipo de cuenta', 'Banco', 'Estado' ];
    columnPropertyMap = {
        'Número de cuenta': 'numeroCuenta',
        'Tipo de cuenta': 'nombreTipoCuenta',
        'Banco': 'nombreBanco',
        'Estado': 'estado',
    };

    buttons: IButton[] = [
        {
            label: 'Edit',
            icon: 'edit',
            action: (element) => {
                console.log('Editing', element);
                this.selectedData = element;
                this.onEdit();
            }
        },
    ];

    constructor(
        private _matDialog: MatDialog,
        private estadoDatosService: EstadosDatosService,
        private cuentasService: CuentasBancariasService
    ) {
    }

    onNew() {
        this._matDialog.open(FormCuentasComponent, {
            autoFocus: false,
            data: {
                edit: false,
            },
            maxHeight: '90vh',
            maxWidth: '100%',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        })
    }

    onEdit() {
        this._matDialog.open(FormCuentasComponent, {
            autoFocus: false,
            data: {
                edit: true,
                data: this.selectedData
            },
            maxHeight: '90vh',
            maxWidth: '100%',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        })
    }

    getCuentas(): void {
        this.subcription$ = this.cuentasService.getCuentas().pipe(
            map((response) => {
                response.data.forEach((items) => {
                    if (items.estado) {
                        items.estado = Estados.ACTIVO;
                        return items;
                    }else {
                        items.estado = Estados.INACTIVO;
                        return items;
                    }
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
                this.getCuentas();
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
        this.getCuentas();
        this.listenGrid();
    }

}
