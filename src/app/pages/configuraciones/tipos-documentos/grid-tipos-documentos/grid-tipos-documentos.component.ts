import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { TiposDocumentosService } from '../../../../core/services/tipos-documentos.service';

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
export class GridTiposDocumentosComponent implements OnInit, OnDestroy{
    public subcription$: Subscription;
    public selectedData: any;

    data = [];

    columns = ['Estado', 'Código', 'Nombre documento'];
    columnPropertyMap = {
        'Estado': 'estado',
        'Código': 'codigo',
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
        private estadoDatosService: EstadosDatosService,
        private tiposDocumentosServices: TiposDocumentosService
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

    getDocumentos(): void {
        this.subcription$ = this.tiposDocumentosServices.getTiposDocumentos().subscribe((response) => {
            this.data = response.data;
        })
    }

    private listenGrid() {
        const refreshData$ = this.estadoDatosService.stateGrid.asObservable();

        refreshData$.subscribe((state) => {
            if (state) {
                this.getDocumentos();
            }
        })

    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngOnInit(): void {
        this.getDocumentos();
        this.listenGrid();
    }


}
