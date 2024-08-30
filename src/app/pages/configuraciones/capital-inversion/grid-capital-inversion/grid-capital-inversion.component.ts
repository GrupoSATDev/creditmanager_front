import { Component } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { MatDialog } from '@angular/material/dialog';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { FormCapitalInversionComponent } from '../form-capital-inversion/form-capital-inversion.component';

@Component({
  selector: 'app-grid-capital-inversion',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
    ],
  templateUrl: './grid-capital-inversion.component.html',
  styleUrl: './grid-capital-inversion.component.scss'
})
export class GridCapitalInversionComponent {
    public subcription$: Subscription;
    public selectedData: any;

    data = [];

    columns = ['Nombre inversor', 'Rubro inversion'];
    columnPropertyMap = {
        'Nombre inversor': 'Nombreinversor',
        'Rubro inversion': 'Rubroinversion',
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

    onNew() {
        this._matDialog.open(FormCapitalInversionComponent, {
            autoFocus: false,
            data: {
                edit: false,
            },
            maxHeight: '90vh',
            maxWidth: '100%',
        })
    }

    onEdit(): void {
        this._matDialog.open(FormCapitalInversionComponent, {
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
