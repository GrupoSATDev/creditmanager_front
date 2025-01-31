import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { DateAdapter, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CreditosService } from '../../../../core/services/creditos.service';
import { TiposPagosService } from '../../../../core/services/tipos-pagos.service';
import { CapitalInversionService } from '../../../../core/services/capital-inversion.service';
import { EstadoCreditosService } from '../../../../core/services/estado-creditos.service';
import { TasasInteresService } from '../../../../core/services/tasas-interes.service';
import { map, Subscription, tap } from 'rxjs';
import { SwalService } from '../../../../core/services/swal.service';
import { Estados } from '../../../../core/enums/estados';
import { CodigoEstadosCreditos, EstadosCreditos } from '../../../../core/enums/estados-creditos';
import { guardar } from '../../../../core/constant/dialogs';
import { CodigosEstadosSolicitudes } from '../../../../core/enums/estados-solicitudes';
const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-detalle-edit',
  standalone: true,
    imports: [
        CdkScrollable,
        AsyncPipe,
        CurrencyPipe,
        DatePipe,
        FuseAlertComponent,
        MatAnchor,
        MatButton,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatError,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        MatSuffix,
        NgForOf,
        NgIf,
        NgxMaskDirective,
        ReactiveFormsModule,
        RouterLink,
    ],
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        provideNgxMask(maskConfig)
    ],
  templateUrl: './form-detalle-edit.component.html',
  styleUrl: './form-detalle-edit.component.scss'
})
export class FormDetalleEditComponent implements OnInit, OnDestroy {
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
    private currencyPipe = inject(CurrencyPipe);
    private swalService = inject(SwalService);
    private readonly parametroTasa = 'Activas';

    enDeudamiento: any;
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

    maxAmountValidator(control: AbstractControl): ValidationErrors | null {

        if (control.value === null || control.value === undefined || control.value === '') {
            return null; // Permite que Validators.required gestione los casos de campo vacío.
        }

        console.log(control.value)

        const amount = parseFloat(control.value.toString().replace(/,/g, ''));
        console.log(amount)

        if (amount === 0) {
            return {valueZero: true}
        }

        if (amount > this.enDeudamiento) {
            console.log('Si entra')
            return { exceedsBalance: true };
        }

        return null;
    }

    get cupoAprobado() {
        return this.form.get('cupoAprobado');
    }

    getCredito(id) {
        this.subcription$ = this.creditoService.getCredito(id).subscribe((response) => {
            this.items = response.data;
            this.form.get('capacidadEndeudamiento').setValue(this.currencyPipe.transform(this.items.trabajador.capacidadEndeudamiento, 'USD', 'symbol', '1.2-2'))
            this.form.get('fechaLimitePago').setValue(this.datePipe.transform(this.items.fechaLimitePago, 'yyyy-MM-dd'))
            this.enDeudamiento = (this.items.trabajador.salarioDevengado * this.items.procMaxPrestamo) / 100;
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
            let fechaVencimientoTransform = this.datePipe.transform(fechaVencimiento, 'yyyy-MM-dd');
            let fechaCorteTransform = this.datePipe.transform(fechaCorte, 'yyyy-MM-dd');
            let fechaLimitePagoTransform = this.datePipe.transform(fechaLimitePago, 'yyyy-MM-dd');
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

    onRechazado() {
        const createData = {
            id: this.idCredito,
            idEstado: EstadosCreditos.RECHAZADO
        }

        const dialog = this.fuseService.open({
            ...guardar
        });

        dialog.afterClosed().subscribe((response) => {

            if (response === 'confirmed') {
                this.creditoService.patchRechazado(createData).subscribe((res) => {
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

    createForm() {
        this.form = this.fb.group({
            cupoAprobado: ['', [Validators.required, this.maxAmountValidator.bind(this)]],
            idTipoPago: [''],
            capacidadEndeudamiento: [{value: '', disabled: true}],
            fechaLimitePago: ['', [Validators.required]],
            idCapitalInversion: [''],
            idTasaInteres: ['', [Validators.required]],
            fechaVencimiento: ['', [Validators.required]],
            fechaCorte: ['', [Validators.required]],
            cantCuotas: ['', [Validators.required, Validators.min(1), Validators.max(36) ]],
        })
    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    protected readonly CodigosEstadosSolicitudes = CodigosEstadosSolicitudes;

}
