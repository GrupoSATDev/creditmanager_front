import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { PagoAliadosService } from '../../../../core/services/pago-aliados.service';

@Component({
  selector: 'app-grid-aliados',
  standalone: true,
    imports: [
        AsyncPipe,
        CustomTableComponent,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        NgForOf,
        NgIf,
        MatButton,
    ],
  templateUrl: './grid-aliados.component.html',
  styleUrl: './grid-aliados.component.scss'
})
export class GridAliadosComponent implements OnInit, OnDestroy{
    public subcription$: Subscription;
    public selectedData: any;

    private pagoAliadoService = inject(PagoAliadosService);

    data = [];

    columns = ['Fecha inicial', 'Tipo de cuenta', 'Total', ];
    columnPropertyMap = {
        'Fecha inicial': 'FechaIncial',
        'Empresa': 'NombreSubempresa ',
        'Total': 'Total'
    };

    buttons: IButton[] = [
        {
            label: 'Edit',
            icon: 'edit',
            action: (element) => {
                console.log('Editing', element);
                this.selectedData = element;
            }
        },
    ];

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.getAliados();
    }

    onNew() {

    }

    public getAliados() {
        this.pagoAliadoService.getAliados().subscribe((response) => {

            this.data = response.data;

        })
    }

}
