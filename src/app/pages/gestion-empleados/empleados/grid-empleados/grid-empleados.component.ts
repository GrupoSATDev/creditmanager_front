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
import { EmpleadosService } from '../../../../core/services/empleados.service';
import { FormEmpleadosComponent } from '../form-empleados/form-empleados.component';
import { Estados } from '../../../../core/enums/estados';

@Component({
  selector: 'app-grid-empleados',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
    ],
  templateUrl: './grid-empleados.component.html',
  styleUrl: './grid-empleados.component.scss'
})
export class GridEmpleadosComponent implements OnInit, OnDestroy{
    public subcription$: Subscription;
    public selectedData: any;

    data = [];

    columns = ['Tipo de documento', 'Identificación','Primer nombre', 'Segundo nombre', 'Primer apellido', 'Segundo apellido', 'Dirección', 'Teléfono', 'Cargo',];
    columnPropertyMap = {
        'Tipo de documento': 'idTipoDoc',
        'Identificación': 'numDoc',
        'Primer nombre': 'primerNombre',
        'Segundo nombre': 'segundoNombre',
        'Primer apellido': 'primerApellido',
        'Segundo apellido': 'segundoApellido',
        'Dirección': 'direccion',
        'Teléfono': 'telefono',
        'Cargo': 'cargo',
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
        private empleadoService: EmpleadosService
    ) {
    }

    onNew() {
        this._matDialog.open(FormEmpleadosComponent, {
            autoFocus: false,
            data: {
                edit: false,
            },
            maxHeight: '90vh',
            width: '50%',
            maxWidth: '100%',
        })
    }

    onEdit(): void {
        this._matDialog.open(FormEmpleadosComponent, {
            autoFocus: false,
            data: {
                edit: true,
                data: this.selectedData
            },
            maxHeight: '90vh',
            maxWidth: '100%',
        })
    }

    getEmpleados(): void {
        this.subcription$ = this.empleadoService.getEmpleados().pipe(
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
            this.data = response.data;
        })
    }

    private listenGrid() {
        const refreshData$ = this.estadoDatosService.stateGrid.asObservable();

        refreshData$.subscribe((state) => {
            if (state) {
                this.getEmpleados();
            }
        })

    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngOnInit(): void {
        this.getEmpleados();
        this.listenGrid();
    }

}
