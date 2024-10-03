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
import { AsyncPipe, CurrencyPipe, DatePipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { CodigosEstadosSolicitudes } from '../../../../core/enums/estados-solicitudes';
import { TiposPagosService } from '../../../../core/services/tipos-pagos.service';
import { Estados } from '../../../../core/enums/estados';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { CapitalInversionService } from '../../../../core/services/capital-inversion.service';
import { EstadoCreditosService } from '../../../../core/services/estado-creditos.service';
import { TasasInteresService } from '../../../../core/services/tasas-interes.service';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { guardar } from '../../../../core/constant/dialogs';
import { CodigoEstadosCreditos } from '../../../../core/enums/estados-creditos';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

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
        ReactiveFormsModule,
        JsonPipe,
        NgxMaskDirective,
    ],
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        provideNgxMask(maskConfig)
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
    private fb = inject(FormBuilder);
    public form: FormGroup;
    private datePipe = inject(DatePipe);
    data = [];
    capital = [];
    estadoCredito = [];
    tasas = [];
    idCredito: string = '';


    ngOnInit(): void {
        this.idCredito = this.activatedRoute.snapshot.paramMap.get('id');
        this.getCredito(this.idCredito);
        this.getTiposPagos();
        this.getCapital();
        this.getEstadoCredito();
        this.getTasas();
        this.createForm();
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

    onSave() {
        if (this.form.valid) {
            const data = this.form.getRawValue();
            const {fechaVencimiento, fechaCorte, cupoAprobado, ...form} = data;
            let fechaVencimientoTransform = this.datePipe.transform(fechaVencimiento, `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`);
            let fechaCorteTransform = this.datePipe.transform(fechaCorte, `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`);
            const createData = {
                fechaVencimiento: fechaVencimientoTransform,
                fechaCorte: fechaCorteTransform,
                idEstadoCredito: CodigoEstadosCreditos.APROBADO,
                cupoAprobado: Number(cupoAprobado),
                id: this.idCredito,
                ...form
            };
            console.log(createData)

            const dialog = this.fuseService.open({
                ...guardar
            });

            dialog.afterClosed().subscribe((response) => {

                if (response === 'confirmed') {
                    this.creditoService.putCredito(createData).subscribe((res) => {
                        this.estadosDatosService.stateGrid.next(true);
                        this.toasService.toasAlertWarn({
                            message: 'Registro creado con exito!',
                            actionMessage: 'Cerrar',
                            duration: 3000
                        })
                        this.router.navigate(['/pages/gestion-creditos/creditos']);
                    })
                }
            })
        }
    }

    createForm() {
        this.form = this.fb.group({
            cupoAprobado: [''],
            idTipoPago: [''],
            idCapitalInversion: [''],
            idTasaInteres: [''],
            fechaVencimiento: [''],
            fechaCorte: [''],
            cantCuotas: [''],
        })
    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    protected readonly CodigosEstadosSolicitudes = CodigosEstadosSolicitudes;
}
