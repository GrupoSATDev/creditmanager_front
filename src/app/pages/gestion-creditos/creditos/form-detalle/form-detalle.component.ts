import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { CreditosService } from '../../../../core/services/creditos.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe, CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { CodigosEstadosSolicitudes } from '../../../../core/enums/estados-solicitudes';
import { TiposPagosService } from '../../../../core/services/tipos-pagos.service';
import { Estados } from '../../../../core/enums/estados';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { CapitalInversionService } from '../../../../core/services/capital-inversion.service';
import { EstadoCreditosService } from '../../../../core/services/estado-creditos.service';
import { TasasInteresService } from '../../../../core/services/tasas-interes.service';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';

@Component({
  selector: 'app-form-detalle',
  standalone: true,
    imports: [
        CdkScrollable,
        MatAnchor,
        MatIcon,
        RouterLink,
        NgIf,
        CurrencyPipe,
        DatePipe,
        MatButton,
        AsyncPipe,
        MatFormField,
        MatLabel,
        MatOption,
        MatSelect,
        NgForOf,
        FormsModule,
        MatInput,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatSuffix,
    ],
  templateUrl: './form-detalle.component.html',
  styleUrl: './form-detalle.component.scss'
})
export class FormDetalleComponent implements OnInit, OnDestroy {
    public toasService = inject(ToastAlertsService);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    private activatedRoute = inject(ActivatedRoute);
    private creditoService: CreditosService = inject(CreditosService);
    private router = inject(Router);
    private tiposPagos: TiposPagosService = inject(TiposPagosService);
    private capitalInversion: CapitalInversionService = inject(CapitalInversionService);
    private estadoCreditoService = inject(EstadoCreditosService);
    private tasaService = inject(TasasInteresService);
    public subcription$: Subscription;
    public items: any;
    public detalleEmpleado: any;
    data = [];
    capital = [];
    estadoCredito = [];
    tasas = [];


    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.getCredito(id);
        this.getTiposPagos();
        this.getCapital();
        this.getEstadoCredito();
        this.getTasas();
    }

    getCredito(id) {
        this.subcription$ = this.creditoService.getCredito(id).subscribe((response) => {
            this.items = response.data;
            this.detalleEmpleado = response.data;
        })
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

    getTasas() {
        this.subcription$ = this.tasaService.getTass().pipe(
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
            this.tasas = response.data;
        })
    }

    getEstadoCredito() {
        this.subcription$ = this.estadoCreditoService.getEstadoCreditos().pipe(
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
            this.estadoCredito = response.data;
        })
    }

    getCapital() {
        this.subcription$ = this.capitalInversion.getCapitales().pipe(
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
            this.capital = response.data;
        })
    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    protected readonly CodigosEstadosSolicitudes = CodigosEstadosSolicitudes;
}
