import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CodigosDetalleConsumo } from '../../../../core/enums/detalle-consumo';
import { CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CobroTrabajadoresService } from '../../../../core/services/cobro-trabajadores.service';
import { Subscription } from 'rxjs';
import { MatDivider } from '@angular/material/divider';

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

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.idCredito = this.activatedRoute.snapshot.paramMap.get('id');
        this.getDetalle(this.idCredito)
    }

    getDetalle(id) {
        this.subcription$ = this.cobroTrabadorService.getCobroEmpleado(id).subscribe((response) => {
            console.log(response)
            this.detalle = response.data;
        })
    }

}
