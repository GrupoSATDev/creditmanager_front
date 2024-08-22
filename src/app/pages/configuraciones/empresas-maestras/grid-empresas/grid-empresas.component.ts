import { Component } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { CommonModule } from '@angular/common';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';

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

    data = [
        { 'Razon social': 'CrediGO', Direccion: 'Via 11 no - 138', Estado: true },
        { 'Razon social': 'Crediplus', Direccion: 'Via 11 no - 138', Estado: true },
    ];

    columns = ['Razon social', 'Direccion', 'Estado'];

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

}
