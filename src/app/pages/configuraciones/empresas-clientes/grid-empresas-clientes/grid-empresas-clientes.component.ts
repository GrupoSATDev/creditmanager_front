import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatDialog } from '@angular/material/dialog';
import { FormEmpresasClientesComponent } from '../form-empresas-clientes/form-empresas-clientes.component';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { map, Subscription } from 'rxjs';
import { EmpresasClientesService } from '../../../../core/services/empresas-clientes.service';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { Estados } from '../../../../core/enums/estados';

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
export class GridEmpresasClientesComponent implements OnInit, OnDestroy{

    public subcription$: Subscription;
    public selectedData: any;
    public searchTerm: string = '';
    constructor(
        private _matDialog: MatDialog,
        private empresaClienteService: EmpresasClientesService,
        private estadoDatosService: EstadosDatosService
    ) {
    }

    data = [];

    columns = ['Nit', 'Razon social', 'Correo', 'Telefono', 'Direccion', 'Estado'];

    columnPropertyMap = {
        'Nit': 'nit',
        'Razon social': 'razonSocial',
        'Correo': 'correo',
        'Telefono': 'telefono',
        'Direccion': 'direccion',
        'Estado': 'estado',
    };

    buttons: IButton[] = [
        {
            label: 'Edición',
            icon: 'edit',
            action: (element) => {
                console.log('Editing', element);
                this.selectedData = element;
                this.onEdit();
            }
        },
    ];

    onNew(): void {
        this._matDialog.open(FormEmpresasClientesComponent, {
            autoFocus: false,
            data: {
                edit: false,
            },
            maxHeight: '90vh',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        });
    }

    onEdit(): void {
        this._matDialog.open(FormEmpresasClientesComponent, {
            autoFocus: false,
            data: {
                edit: true,
                data: this.selectedData
            },
            maxHeight: '90vh',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        });
    }

    getEmpresas() {
        this.subcription$ = this.empresaClienteService.getEmpresas().pipe(
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
                this.getEmpresas();
            }
        })

    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngOnInit(): void {
        this.getEmpresas();
        this.listenGrid();
    }

}
