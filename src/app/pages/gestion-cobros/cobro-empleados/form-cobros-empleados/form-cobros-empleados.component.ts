import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CodigosDetalleConsumo } from '../../../../core/enums/detalle-consumo';
import { AsyncPipe, CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CobroTrabajadoresService } from '../../../../core/services/cobro-trabajadores.service';
import { map, Subscription } from 'rxjs';
import { MatDivider } from '@angular/material/divider';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-form-cobros-empleados',
  standalone: true,
    imports: [
        CdkScrollable,
        CurrencyPipe,
        DatePipe,
        MatAnchor,
        MatButton,
        MatIcon,
        NgIf,
        RouterLink,
        NgForOf,
        MatDivider,
        AsyncPipe,
        CustomTableComponent,
        MatFormField,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
    ],
    providers: [
        DatePipe,
        CurrencyPipe
    ],
  templateUrl: './form-cobros-empleados.component.html',
  styleUrl: './form-cobros-empleados.component.scss'
})
export class FormCobrosEmpleadosComponent implements OnInit, OnDestroy{
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private cobroTrabadorService = inject(CobroTrabajadoresService);
    public detalle: any;
    idCredito: string = '';
    public subcription$: Subscription;
    private datePipe = inject(DatePipe);
    private currencyPipe = inject(CurrencyPipe);

    columns = ['Fecha de cobro', 'Nombre completo', 'Empresa', 'Concepto', 'Valor pendiente', 'Valor cuota', 'No. cuota', 'Estado'];

    columnPropertyMap = {
        'Fecha de cobro': 'fechaCobro',
        'Nombre completo': 'nombreTrabajador',
        'Empresa': 'nombreSubEmpresa',
        'Concepto': 'tipoConsumo',
        'Valor pendiente': 'valorPendiente',
        'Valor cuota': 'montoCuota',
        'No. cuota': 'numCuota',
        'Estado': 'nombreEstadoCredito',
    };

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.idCredito = this.activatedRoute.snapshot.paramMap.get('id');
        this.getDetalle(this.idCredito)
    }

    getDetalle(id) {
        this.subcription$ = this.cobroTrabadorService.getCobroEmpleado(id).pipe(
            map((response) => {
                response.data.forEach((items) => {
                    items.fechaCobro = this.datePipe.transform(items.fechaCobro, 'dd/MM/yyyy');
                    items.valorPendiente = this.currencyPipe.transform(items.valorPendiente, 'USD', 'symbol', '1.2-2');
                    items.montoCuota = this.currencyPipe.transform(items.montoCuota, 'USD', 'symbol', '1.2-2');
                    //items.nombreTrabajador = this.datePipe.transform(items.nombreTrabajador, 'titlecase');
                })
                return response;
            })
        ).subscribe((response) => {
            console.log(response)
            this.detalle = response.data;
        })
    }

}
