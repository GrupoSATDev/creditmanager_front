import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatDialog } from '@angular/material/dialog';
import { FormEmpresasClientesComponent } from '../form-empresas-clientes/form-empresas-clientes.component';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';

@Component({
  selector: 'app-grid-empresas-clientes',
  standalone: true,
    imports: [
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        CustomTableComponent,
    ],
  templateUrl: './grid-empresas-clientes.component.html',
  styleUrl: './grid-empresas-clientes.component.scss'
})
export class GridEmpresasClientesComponent {

    constructor(
        private _matDialog: MatDialog
    ) {
    }

    data = [
        {'Nit': 101010, 'Razon social': 'Crediplus', 'Correo': 'crediplus@gmail.com', 'Telefono': 3456777, 'Direccion': 'Calle 70 no 60 - 61'},
        {'Nit': 101012, 'Razon social': 'Credirapid', 'Correo': 'credirapid@gmail.com', 'Telefono': 3456779, 'Direccion': 'Calle 91 no 100 - 61'},
    ];

    columns = ['Nit', 'Razon social', 'Correo', 'Telefono', 'Direccion'];

    buttons: IButton[] = [
        {
            label: 'Edit',
            icon: 'edit',
            action: (element) => {
                console.log('Editing', element);
            }
        },
        {
            label: 'Delete',
            icon: 'delete',
            action: (element) => {
                console.log('Deleting', element);
            }
        }
    ];

    onNew(): void {
        this._matDialog.open(FormEmpresasClientesComponent, {
            autoFocus: false,
            data: {
                note: {},
            },
            maxHeight: '90vh',
            maxWidth: '100%',
        });
    }

}
