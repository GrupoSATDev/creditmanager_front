import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { map, Subscription } from 'rxjs';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { MatDialog } from '@angular/material/dialog';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { FormCapitalInversionComponent } from '../form-capital-inversion/form-capital-inversion.component';
import { Estados } from '../../../../core/enums/estados';
import { CapitalInversionService } from '../../../../core/services/capital-inversion.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-grid-capital-inversion',
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
  templateUrl: './grid-capital-inversion.component.html',
  styleUrl: './grid-capital-inversion.component.scss'
})
export class GridCapitalInversionComponent implements OnInit, OnDestroy{
    public subcription$: Subscription;
    public selectedData: any;
    private datePipe = inject(DatePipe);
    private currencyPipe = inject(CurrencyPipe);

    data = [];

    columns = ['Inversor', 'Rubro invertido', 'Rubro disponible', 'Fecha de retorno', 'Detalle de inversión'];
    columnPropertyMap = {
        'Inversor': 'nombreInversor',
        'Rubro invertido': 'rubroInversion',
        'Rubro disponible': 'montoDisponible',
        'Fecha de retorno': 'fechaCreacion',
        'Detalle de inversión': 'detalleInversion',
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
        private capitalService: CapitalInversionService
    ) {
    }

    onNew() {
        this._matDialog.open(FormCapitalInversionComponent, {
            autoFocus: false,
            data: {
                edit: false,
            },
            maxHeight: '90vh',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        })
    }

    onEdit(): void {
        this._matDialog.open(FormCapitalInversionComponent, {
            autoFocus: false,
            data: {
                edit: true,
                data: this.selectedData
            },
            maxHeight: '90vh',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        })
    }

    getCapital(): void {
        this.subcription$ = this.capitalService.getCapitales().pipe(
            map((response) => {
                response.data.forEach((items) => {
                    if (items.estado) {
                        items.estado = Estados.ACTIVO;
                        return items;
                    }
                })
                return response;

            }),
            map((response) => {
                response.data.forEach((items) => {
                    items.fechaCreacion = this.datePipe.transform(items.fechaCreacion, 'dd/MM/yyyy');
                    items.rubroInversion = this.currencyPipe.transform(items.rubroInversion, 'USD', 'symbol', '1.2-2');
                    items.montoDisponible = this.currencyPipe.transform(items.montoDisponible, 'USD', 'symbol', '1.2-2');
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
                this.getCapital();
            }
        })

    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngOnInit(): void {
        this.getCapital();
        this.listenGrid();
    }

}
