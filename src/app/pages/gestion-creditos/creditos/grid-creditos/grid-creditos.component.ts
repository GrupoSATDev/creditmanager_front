import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { map, Subscription } from 'rxjs';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { CreditosService } from '../../../../core/services/creditos.service';
import { Estados } from '../../../../core/enums/estados';

@Component({
  selector: 'app-grid-creditos',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
    ],
    providers: [
        DatePipe
    ],
  templateUrl: './grid-creditos.component.html',
  styleUrl: './grid-creditos.component.scss'
})
export class GridCreditosComponent implements OnInit, OnDestroy {
    public subcription$: Subscription;
    public selectedData: any;
    private datePipe = inject(DatePipe);
    private router = inject(Router);
    private estadoDatosService: EstadosDatosService = inject(EstadosDatosService);
    private creditoService: CreditosService = inject(CreditosService);

    data = [];

    columns = ['Empleado','Cupo solicitado', 'Empresa', 'Estado', 'Fecha de solicitud'];
    columnPropertyMap = {
        'Empleado': 'nombreTrabajador',
        'Cupo solicitado': 'cupoConsumido',
        'Empresa': 'nombreEmpresaMaestra',
        'Estado': 'nombreEstadoCredito',
        'Fecha de solicitud': 'fechaCreacion',
    };

    buttons: IButton[] = [
        {
            label: 'View',
            icon: 'visibility',
            action: (element) => {
                console.log('Approve', element);
                this.selectedData = element;
                //this.router.navigate(['pages/gestion-creditos/solicitudes/estados', this.selectedData.id])

            }
        },
    ];

    getCreditos() {
        this.subcription$ = this.creditoService.getCreditos().pipe(
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
                    items.fechaCreacion = this.datePipe.transform(items.fechaCreacion, 'dd/MM/yyyy');
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
        this.getCreditos();
    }

}
