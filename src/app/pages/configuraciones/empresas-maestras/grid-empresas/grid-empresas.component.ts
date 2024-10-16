import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { CommonModule } from '@angular/common';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { MatDialog } from '@angular/material/dialog';
import { FormEmpresasComponent } from '../form-empresas/form-empresas.component';
import { EmpresasMaestrasService } from '../../../../core/services/empresas-maestras.service';
import { Subscription } from 'rxjs';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';




@Component({
  selector: 'app-grid-empresas',
  standalone: true,
    imports: [
        CommonModule,
        MatFormField,
        MatIcon,
        MatButton,
        MatInput,
        CustomTableComponent,
    ],
  templateUrl: './grid-empresas.component.html',
  styleUrl: './grid-empresas.component.scss'
})
export class GridEmpresasComponent implements OnInit, AfterViewInit, OnDestroy{

    public subcription$: Subscription;
    public selectedData: any;
    public searchTerm: string = '';

    constructor(
        private _matDialog: MatDialog,
        private empresasService: EmpresasMaestrasService,
        private estadoDatosService: EstadosDatosService
    ) {
    }

    data = [];

    columns = ['Nit', 'Razon social', 'Correo', 'Telefono', 'Direccion'];
    columnPropertyMap = {
        'Nit': 'nit',
        'Razon social': 'razonSocial',
        'Correo': 'correo',
        'Telefono': 'telefono',
        'Direccion': 'direccion'
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
        /*{
            label: 'Delete',
            icon: 'delete',
            action: (element) => {
                console.log('Deleting', element);
            }
        }*/
    ];

    onNew(): void {
        this._matDialog.open(FormEmpresasComponent, {
            autoFocus: false,
            data: {
                edit: false,
            },
            maxHeight: '90vh',
            width: '50%',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        });
    }

    onEdit(): void {
        this._matDialog.open(FormEmpresasComponent, {
            autoFocus: false,
            data: {
                edit: true,
                data: this.selectedData
            },
            maxHeight: '90vh',
            width: '50%',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        })
    }

    getEmpresas() {
        this.subcription$ = this.empresasService.getEmpresas().subscribe((response) => {
            this.data = response.data;
        })

    }

    ngOnInit(): void {
        this.getEmpresas();
        this.listenGrid();
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

    ngAfterViewInit(): void {

    }

}
