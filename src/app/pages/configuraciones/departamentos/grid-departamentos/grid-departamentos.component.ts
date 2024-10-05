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
import { FormDepartamentosComponent } from '../form-departamentos/form-departamentos.component';
import { LocacionService } from '../../../../core/services/locacion.service';
import { Estados } from '../../../../core/enums/estados';

@Component({
  selector: 'app-grid-departamentos',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
    ],
  templateUrl: './grid-departamentos.component.html',
  styleUrl: './grid-departamentos.component.scss'
})
export class GridDepartamentosComponent implements OnInit, OnDestroy{
    public subcription$: Subscription;
    public selectedData: any;

    data = [];

    columns = ['Estado', 'Código DANE', 'Nombre departamento'];
    columnPropertyMap = {
        'Estado': 'estado',
        'Nombre departamento': 'nombre',
        'Código DANE': 'codigoDane',
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
        private locacionService: LocacionService
    ) {
    }

    onNew(): void {
        this._matDialog.open(FormDepartamentosComponent, {
            autoFocus: false,
            data: {
                edit: false,
            },
            maxHeight: '90vh',
            maxWidth: '100%',
            disableClose: true
        })
    }

    onEdit(): void {
        this._matDialog.open(FormDepartamentosComponent, {
            autoFocus: false,
            data: {
                edit: true,
                data: this.selectedData
            },
            maxHeight: '90vh',
            maxWidth: '100%',
            disableClose: true
        })
    }

    getDepartamentos() {
        this.subcription$ = this.locacionService.getDepartamentos().pipe(
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
                this.getDepartamentos();
            }
        })

    }


    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngOnInit(): void {
        this.getDepartamentos();
        this.listenGrid();

    }

}
