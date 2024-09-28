import { Component } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';

@Component({
  selector: 'app-grid-cobros-empleados',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
    ],
  templateUrl: './grid-cobros-empleados.component.html',
  styleUrl: './grid-cobros-empleados.component.scss'
})
export class GridCobrosEmpleadosComponent {
    public subcription$: Subscription;
    public selectedData: any;
    public searchTerm: string = '';

    data = [];

    columns = ['Fecha cuota', 'Valor cuota', 'Valor pagado', 'Estado'];

    columnPropertyMap = {
        'Nit': 'nit',
        'Razon social': 'razonSocial',
        'Correo': 'correo',
        'Telefono': 'telefono',
        'Direccion': 'direccion'
    };

    buttons: IButton[] = [
        {
            label: 'View',
            icon: 'visibility',
            action: (element) => {
                console.log('Editing', element);
                this.selectedData = element;
            }
        },
    ];

    constructor(
        private _matDialog: MatDialog,

    ) {
    }

}
