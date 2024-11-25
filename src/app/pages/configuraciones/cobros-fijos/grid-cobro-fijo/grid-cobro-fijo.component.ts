import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { FormCobroFijoComponent } from '../form-cobro-fijo/form-cobro-fijo.component';
import { MatDialog } from '@angular/material/dialog';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';

@Component({
  selector: 'app-grid-cobro-fijo',
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
  templateUrl: './grid-cobro-fijo.component.html',
  styleUrl: './grid-cobro-fijo.component.scss'
})
export class GridCobroFijoComponent implements OnInit, OnDestroy{
    public subcription$: Subscription;
    public selectedData: any;
    private datePipe = inject(DatePipe);
    private currencyPipe = inject(CurrencyPipe);
    public searchTerm: string = '';
    private _matDialog = inject(MatDialog);
    private estadoDatosService: EstadosDatosService = inject(EstadosDatosService);

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

    onNew() {
        this._matDialog.open(FormCobroFijoComponent, {
            autoFocus: false,
            data: {
                edit: false,
            },
            maxHeight: '90vh',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        })
    }

    onEdit() {
        this._matDialog.open(FormCobroFijoComponent, {
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

    private listenGrid() {
        const refreshData$ = this.estadoDatosService.stateGrid.asObservable();

        refreshData$.subscribe((state) => {
            if (state) {

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
