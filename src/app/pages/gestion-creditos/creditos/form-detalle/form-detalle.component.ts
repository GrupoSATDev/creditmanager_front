import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, Subscription, tap } from 'rxjs';
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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { CapitalInversionService } from '../../../../core/services/capital-inversion.service';
import { EstadoCreditosService } from '../../../../core/services/estado-creditos.service';
import { TasasInteresService } from '../../../../core/services/tasas-interes.service';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { guardar } from '../../../../core/constant/dialogs';
import { CodigoEstadosCreditos } from '../../../../core/enums/estados-creditos';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { SwalService } from '../../../../core/services/swal.service';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';

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
        FuseAlertComponent,
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
    private fb = inject(FormBuilder);
    public form: FormGroup;
    private datePipe = inject(DatePipe);
    private swalService = inject(SwalService);
    private readonly parametroTasa = 'Activas';
    tipoPagos$ = this.tiposPagos.getTiposPagos().pipe(
        tap((response) => {
            const valorSelected = response.data;
            if (valorSelected) {
                this.form.get('idTipoPago').setValue(valorSelected[0].id)
            }
        })
    )
    capital$ = this.capitalInversion.getCapitales().pipe(
        tap((response) => {
            const valorSelected = response.data;
            if (valorSelected) {
                this.form.get('idCapitalInversion').setValue(valorSelected[0].id)
            }
        })
    );
    estadoCredito = [];
    tasas$ = this.tasaService.getTasasParametros(this.parametroTasa).pipe(
        tap((response) => {
            const valorSelected = response.data;
            if (valorSelected) {
                this.form.get('idTasaInteres').setValue(valorSelected[0].id)
            }
        })
    );
    idCredito: string = '';


    ngOnInit(): void {
        this.idCredito = this.activatedRoute.snapshot.paramMap.get('id');
        this.getCredito(this.idCredito);
        this.getEstadoCredito();
        this.createForm();
    }

    getCredito(id) {
        this.subcription$ = this.creditoService.getCredito(id).subscribe((response) => {
            this.items = response.data;
            this.form.get('capacidadEndeudamiento').setValue(this.items.trabajador.capacidadEndeudamiento)
            this.form.get('fechaLimitePago').setValue(this.datePipe.transform(this.items.fechaLimitePago, `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`))
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

    onSave() {
        if (this.form.valid) {
            const data = this.form.getRawValue();
            const {fechaVencimiento, fechaCorte, cupoAprobado, fechaLimitePago,  capacidadEndeudamiento,  ...form} = data;
            let fechaVencimientoTransform = this.datePipe.transform(fechaVencimiento, `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`);
            let fechaCorteTransform = this.datePipe.transform(fechaCorte, `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`);
            let fechaLimitePagoTransform = this.datePipe.transform(fechaLimitePago, `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`);
            const createData = {
                fechaVencimiento: fechaVencimientoTransform,
                fechaCorte: fechaCorteTransform,
                fechaLimitePago: fechaLimitePagoTransform,
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
                        this.swalService.ToastAler({
                            icon: 'success',
                            title: 'Registro Creado o Actualizado con Exito.',
                            timer: 4000,
                        })
                        this.router.navigate(['/pages/gestion-creditos/creditos']);
                    }, error => {
                        this.swalService.ToastAler({
                            icon: 'error',
                            title: 'Ha ocurrido un error al crear el registro!',
                            timer: 4000,
                        })
                    })
                }
            })
        }
    }

    createForm() {
        this.form = this.fb.group({
            cupoAprobado: ['', [Validators.required]],
            idTipoPago: [''],
            capacidadEndeudamiento: [{value: '', disabled: true}],
            fechaLimitePago: ['', [Validators.required]],
            idCapitalInversion: [''],
            idTasaInteres: ['', [Validators.required]],
            fechaVencimiento: ['', [Validators.required]],
            fechaCorte: ['', [Validators.required]],
            cantCuotas: ['', [Validators.required]],
        })
    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    protected readonly CodigosEstadosSolicitudes = CodigosEstadosSolicitudes;
}
