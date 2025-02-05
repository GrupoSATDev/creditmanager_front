import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { Router } from '@angular/router';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { Subscription, tap } from 'rxjs';
import { SubscripcionService } from '../../../../core/services/subscripcion.service';
import { Estados } from '../../../../core/enums/estados';

@Component({
  selector: 'app-grid-subscripcion',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
    ],
    providers: [
        DatePipe,
        CurrencyPipe
    ],
  templateUrl: './grid-subscripcion.component.html',
  styleUrl: './grid-subscripcion.component.scss',
})
export class GridSubscripcionComponent implements OnInit, OnDestroy {
    public subcription$: Subscription;
    private datePipe = inject(DatePipe);
    private estadoDatosService = inject(EstadosDatosService)
    private subscriptionService = inject(SubscripcionService)
    private router = inject(Router);
    public searchTerm: string = '';

    data = [];

    columns = ['Creación', 'Nombre', 'Estado', ];
    columnPropertyMap = {
        'Creación': 'fechaCreacion',
        'Nombre': 'nombre',
        'Estado': 'estado'
    };

    buttons: IButton[] = [
        {
            label: 'Ver',
            icon: 'visibility',
            action: (element) => {
                console.log('Editing', element);
                //this.router.navigate(['/pages/gestion-cobros/trabajador/individual/', element.id])
            }
        },
    ]

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.getSubscripcion();
    }

    private getSubscripcion() {
        this.subcription$ = this.subscriptionService.getSubcripciones().pipe(
            tap((response) => {
                response.data.forEach((items) => {
                    items.fechaCreacion = this.datePipe.transform(items.fechaCreacion, 'dd/MM/yyyy');
                    items.estado = items.estado ? Estados.ACTIVO : Estados.INACTIVO
                })
                return response;
            })
        ).subscribe((response) => {
            if (response.data) {
                this.data = response.data;
            }
        })
    }

}
