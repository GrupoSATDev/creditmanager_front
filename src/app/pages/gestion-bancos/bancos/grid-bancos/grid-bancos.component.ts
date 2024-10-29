import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { map, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { GenerosService } from '../../../../core/services/generos.service';
import { FormBancosComponent } from '../form-bancos/form-bancos.component';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { BancosService } from '../../../../core/services/bancos.service';
import { Estados } from '../../../../core/enums/estados';

@Component({
  selector: 'app-grid-bancos',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
    ],
  templateUrl: './grid-bancos.component.html',
  styleUrl: './grid-bancos.component.scss'
})
export class GridBancosComponent  implements OnInit, OnDestroy {
    private bancosService = inject(BancosService);

    public subcription$: Subscription;
    public selectedData: any;

    data = [];

    columns = ['Estado','Nombre'];
    columnPropertyMap = {
        'Estado': 'estado',
        'Nombre': 'nombre',
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
    ) {
    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngOnInit(): void {
        this.getBancos();
        this.listenGrid();
    }

    onNew(): void {
        this._matDialog.open(FormBancosComponent, {
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
        this._matDialog.open(FormBancosComponent, {
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

    getBancos() {
        this.subcription$ = this.bancosService.getBancos().pipe(
            map((response) => {
                response.data.forEach((items) => {
                    if (items.estado) {
                        items.estado = Estados.ACTIVO;
                    }else {
                        items.estado = Estados.INACTIVO;
                    }
                })
                return response;

            })
        ).subscribe((response) => {
            this.data  = response.data;
        })

    }

    private listenGrid() {
        const refreshData$ = this.estadoDatosService.stateGrid.asObservable();

        refreshData$.subscribe((state) => {
            if (state) {
                this.getBancos();
            }
        })

    }

}
