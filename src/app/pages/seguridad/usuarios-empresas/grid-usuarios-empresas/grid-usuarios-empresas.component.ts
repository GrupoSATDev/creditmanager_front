import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { map, Subscription } from 'rxjs';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { FormUsuariosEmpresasComponent } from '../form-usuarios-empresas/form-usuarios-empresas.component';
import { FormEmpleadosComponent } from '../../../gestion-empleados/empleados/form-empleados/form-empleados.component';
import { MatDialog } from '@angular/material/dialog';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { GenerosService } from '../../../../core/services/generos.service';
import { UsuariosService } from '../../../../core/services/usuarios.service';
import { Estados } from '../../../../core/enums/estados';
import { items } from '../../../../mock-api/apps/file-manager/data';

@Component({
  selector: 'app-grid-usuarios-empresas',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
    ],
  templateUrl: './grid-usuarios-empresas.component.html',
  styleUrl: './grid-usuarios-empresas.component.scss'
})
export class GridUsuariosEmpresasComponent implements  OnInit, OnDestroy{
    private usuariosService = inject(UsuariosService);
    public subcription$: Subscription;
    public selectedData: any;
    public searchTerm: string = '';

    data = [];

    columns = ['Estado', 'Usuario', 'Nombre completo', 'Rol', 'Tipo de usuario'];
    columnPropertyMap = {
        'Estado': 'estado',
        'Usuario': 'correo',
        'Nombre completo': 'nombreCompleto',
        'Rol': 'nombreRol',
        'Tipo de usuario': 'nombreTipoUsuario',
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
        private generoService: GenerosService
    ) {
    }

    onNew() {
        this._matDialog.open(FormUsuariosEmpresasComponent, {
            autoFocus: false,
            data: {
                edit: false,
            },
            maxHeight: '90vh',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        })
    }

    onEdit(): void {
        this._matDialog.open(FormUsuariosEmpresasComponent, {
            autoFocus: false,
            data: {
                edit: true,
                data: this.selectedData
            },
            maxHeight: '90vh',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        })
    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    getUsuarios(): void {
        this.subcription$ = this.usuariosService.getUsuarios().pipe(
            map((response) => {
                response.data.forEach((items) => {
                    if (items.estado) {
                        items.estado = Estados.ACTIVO;
                    }else {
                        items.estado = Estados.INACTIVO;
                    }
                })
                return response;
            }),
            map((response) => {
                response.data.forEach((items) => {
                    if (items) {
                        items.nombreCompleto = items.nombre.concat(' ',items.apellido );
                    }
                })
                return response;
            })
        ).subscribe((response) => {
            if (response.data) {
                this.data = response.data;

            }
        })

    }

    ngOnInit(): void {
        this.getUsuarios();
    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }


}
