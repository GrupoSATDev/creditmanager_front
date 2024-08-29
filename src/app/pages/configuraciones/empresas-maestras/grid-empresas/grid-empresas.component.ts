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

    constructor(
        private _matDialog: MatDialog,
        private empresasService: EmpresasMaestrasService
    ) {
    }


    data = [

    ];

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

    getEmpresas() {
        this.subcription$ = this.empresasService.getEmpresas().subscribe((response) => {
            this.data = response.data;
        })

    }

    ngOnInit(): void {
        this.getEmpresas();
    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngAfterViewInit(): void {

    }

}
