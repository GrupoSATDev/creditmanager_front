import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { map, Subscription } from 'rxjs';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { FormCobroFijoComponent } from '../form-cobro-fijo/form-cobro-fijo.component';
import { MatDialog } from '@angular/material/dialog';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { CobrosFijosService } from '../../../../core/services/cobros-fijos.service';

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
    private cobrosFijosService: CobrosFijosService = inject(CobrosFijosService);

    data = [];

    columns = ['Valor aval', 'Valor firma electronica', 'Valor tarjeta', 'Periodo'];
    columnPropertyMap = {
        'Valor aval': 'valorAval',
        'Valor firma electronica': 'valorFirmaElectronica',
        'Valor tarjeta': 'valorTarjeta',
        'Periodo': 'periodo',
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
                this.getCobros();
            }
        })

    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    getCobros() {
        this.subcription$ = this.cobrosFijosService.getCobros().pipe(
            map((response) => {
                response.data.forEach((items) => {
                    items.valorAval = this.currencyPipe.transform(items.valorAval, 'USD', 'symbol', '1.2-2');
                    items.valorFirmaElectronica = this.currencyPipe.transform(items.valorFirmaElectronica, 'USD', 'symbol', '1.2-2');
                    items.valorTarjeta = this.currencyPipe.transform(items.valorTarjeta, 'USD', 'symbol', '1.2-2');
                    items.periodo = this.currencyPipe.transform(items.periodo, 'USD', 'symbol', '1.2-2');
                })
                return response;
            })
        ).subscribe((response) => {
            if(response.data) {
                this.data = response.data;
            }
        })
    }


    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngOnInit(): void {
        this.listenGrid();
        this.getCobros();
    }

}
