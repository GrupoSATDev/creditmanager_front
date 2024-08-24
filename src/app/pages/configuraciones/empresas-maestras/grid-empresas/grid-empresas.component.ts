import { Component, Inject } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { CommonModule } from '@angular/common';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { MatDialog } from '@angular/material/dialog';
import { FormEmpresasComponent } from '../form-empresas/form-empresas.component';

@Component({
  selector: 'app-grid-empresas',
  standalone: true,
    imports: [
        MatFormField,
        MatIcon,
        MatButton,
        MatInput,
        CustomTableComponent,
    ],
  templateUrl: './grid-empresas.component.html',
  styleUrl: './grid-empresas.component.scss'
})
export class GridEmpresasComponent {

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
        this._matDialog.open(FormEmpresasComponent, {
            autoFocus: false,
            data: {
                note: {},
            },
            maxHeight: '90vh',
            maxWidth: '100%',
        });
    }

}
