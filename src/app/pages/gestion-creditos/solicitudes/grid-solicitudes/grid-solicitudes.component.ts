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
import { SolicitudesService } from '../../../../core/services/solicitudes.service';

import { FormSolicitudesComponent } from '../form-solicitudes/form-solicitudes.component';
import { Estados } from '../../../../core/enums/estados';

@Component({
  selector: 'app-grid-solicitudes',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
    ],
  templateUrl: './grid-solicitudes.component.html',
  styleUrl: './grid-solicitudes.component.scss'
})
export class GridSolicitudesComponent implements OnInit, OnDestroy{

    public subcription$: Subscription;
    public selectedData: any;

    data = [];

    columns = ['Cupo', 'Observación'];
    columnPropertyMap = {
        'Cupo': 'cupo',
        'Observación': 'observacion',
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
        private solicitudService: SolicitudesService
    ) {
    }

    onNew() {
        this._matDialog.open(FormSolicitudesComponent, {
            autoFocus: false,
            data: {
                edit: false,
            },
            maxHeight: '90vh',
            maxWidth: '100%',
        })
    }

    onEdit(): void {
        this._matDialog.open(FormSolicitudesComponent, {
            autoFocus: false,
            data: {
                edit: true,
                data: this.selectedData
            },
            maxHeight: '90vh',
            maxWidth: '100%',
        })
    }

    getSolicitudes(): void {
        this.subcription$ = this.solicitudService.getSolicitudes().pipe(
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
                this.getSolicitudes();
            }
        })

    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngOnInit(): void {
        this.getSolicitudes();
        this.listenGrid();
    }



}
