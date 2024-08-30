import { Component } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { FormTiposDocumentosComponent } from '../form-tipos-documentos/form-tipos-documentos.component';

@Component({
  selector: 'app-grid-tipos-documentos',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
    ],
  templateUrl: './grid-tipos-documentos.component.html',
  styleUrl: './grid-tipos-documentos.component.scss'
})
export class GridTiposDocumentosComponent {
    public subcription$: Subscription;
    public selectedData: any;

    data = [];

    columns = ['Estado', 'Nombre documento'];
    columnPropertyMap = {
        'Estado': 'estado',
        'Nombre documento': 'nombreDocumento',
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
        private estadoDatosService: EstadosDatosService
    ) {
    }

    onNew(): void {
        this._matDialog.open(FormTiposDocumentosComponent, {
            autoFocus: false,
            data: {
                edit: false,
            },
            maxHeight: '90vh',
            maxWidth: '100%',
        })
    }

    onEdit(): void {
        this._matDialog.open(FormTiposDocumentosComponent, {
            autoFocus: false,
            data: {
                edit: true,
                data: this.selectedData
            },
            maxHeight: '90vh',
            maxWidth: '100%',
        })
    }


}
