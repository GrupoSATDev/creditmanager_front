import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { map, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { Estados } from '../../../../core/enums/estados';
import { TiposPagosService } from '../../../../core/services/tipos-pagos.service';

@Component({
  selector: 'app-grid-tipos-pagos',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
    ],
  templateUrl: './grid-tipos-pagos.component.html',
  styleUrl: './grid-tipos-pagos.component.scss'
})
export class GridTiposPagosComponent implements OnInit, OnDestroy{

    public subcription$: Subscription;

    data = [];

    columns = ['Estado', 'Tipos de pagos'];
    columnPropertyMap = {
        'Estado': 'estado',
        'Tipos de pagos': 'nombre',
    };

    constructor(
        private tiposPagos: TiposPagosService
    ) {
    }

    getTiposPagos() {
        this.subcription$ = this.tiposPagos.getTiposPagos().pipe(
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

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngOnInit(): void {
        this.getTiposPagos();
    }

}
