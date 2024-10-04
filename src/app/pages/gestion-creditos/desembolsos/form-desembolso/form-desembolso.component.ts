import { Component, inject, ViewChild } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule, ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { FuseAlertComponent, FuseAlertType } from '../../../../../@fuse/components/alert';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DateAdapter, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatStep, MatStepper, MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { TiposDocumentosService } from '../../../../core/services/tipos-documentos.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { EmpleadosService } from '../../../../core/services/empleados.service';
import { TipoConsumosService } from '../../../../core/services/tipo-consumos.service';
import { CuentasBancariasService } from '../../../../core/services/cuentas-bancarias.service';
import { Router } from '@angular/router';
import { LocacionService } from '../../../../core/services/locacion.service';
import { DetalleConsumoService } from '../../../../core/services/detalle-consumo.service';
import { Observable, of, Subscription } from 'rxjs';
import { guardar } from '../../../../core/constant/dialogs';
import { FormatoOptionsPipe } from '../../../../core/pipes/formato-options.pipe';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-desembolso',
  standalone: true,
    imports: [
        AsyncPipe,
        CdkScrollable,
        CurrencyPipe,
        DatePipe,
        FormsModule,
        FuseAlertComponent,
        MatButton,
        MatError,
        MatFormField,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        MatStep,
        MatStepper,
        MatStepperNext,
        MatStepperPrevious,
        NgForOf,
        NgIf,
        NgxMaskDirective,
        ReactiveFormsModule,
        NgClass,
    ],
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        provideNgxMask(maskConfig)
    ],
  templateUrl: './form-desembolso.component.html',
  styleUrl: './form-desembolso.component.scss'
})
export class FormDesembolsoComponent {
    private tiposDocumentosService = inject(TiposDocumentosService);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public toasService = inject(ToastAlertsService);
    private empleadosServices = inject(EmpleadosService)
    private tipoConsumosService = inject(TipoConsumosService)
    private cuentasServices = inject(CuentasBancariasService)
    private datePipe = inject(DatePipe);
    private router = inject(Router);

    private fb = inject(FormBuilder);
    private _locacionService = inject(LocacionService);
    private detalleConsumo = inject(DetalleConsumoService);
    public departamentos$ = this._locacionService.getDepartamentos();
    public municipios$: Observable<any>;
    public tipoConsumo$ = this.tipoConsumosService.getTipoConsumos();
    public cuentas$ = this.cuentasServices.getCuentas();
    @ViewChild('stepper') stepper!: MatStepper;

    public firstFormGroup: FormGroup;
    public secondFormGroup: FormGroup;
    public thirdFormGroup: FormGroup;
    private subscription$: Subscription;
    showAlert: boolean = false;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };

    compareValor: any;

    public tiposDocumentos$ = this.tiposDocumentosService.getTiposDocumentos();
    public creditos = [];
    public detaleConsumo: any;

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.createForm();
    }

    getMunicipios(matSelectChange: MatSelectChange) {
        const id = matSelectChange.value;
        this.municipios$ = this._locacionService.getMunicipio(id);
    }

    selected(matSelectChange: MatSelectChange) {
        const creditos = matSelectChange.value;
        this.compareValor = creditos.cupoDisponible;
        this.thirdFormGroup.get('montoConsumo').setValidators(validateNumbers(this.compareValor))
        this.thirdFormGroup.get('montoConsumo').updateValueAndValidity()
    }

    compareWithConstants(control: AbstractControl): Observable<ValidationErrors | null> {
        const inputValue = control.value;
        const idCredito = this.secondFormGroup.get('idCredito')?.value;

        if (!idCredito || !idCredito.montoConsumo) {
            console.error('No se encontró el objeto idCredito o montoConsumo');
            return of(null);  // Retorna sin error si no encuentra el valor
        }

        console.log(inputValue);
        console.log(idCredito.montoConsumo);
        if (inputValue > idCredito.montoConsumo) {
            return of({ notEqual: true });  // Error si el valor no es igual
        }
        return of(null);  // Sin errores si es igual
    }

    get montoConsumo() {
        return this.thirdFormGroup.get('montoConsumo');
    }

    public onSearch() {
        const data = this.firstFormGroup.getRawValue();
        this.empleadosServices.getEmpleadoParams(data).subscribe((response) => {
            console.log(response);
            if (response) {
                this.showAlert = false;
                const campos = {
                    numDoc: response.data.numDoc,
                    primerNombre: response.data.primerNombre,
                    segundoNombre:  response.data.segundoNombre,
                    primerApellido:  response.data.primerApellido,
                    segundoApellido:  response.data.segundoApellido,
                    idTrabajador: response.data.id,
                    correo: response.data.correo,
                    idCredito: response.data.creditos[0].numCredito + ' - ' + response.data.creditos[0].cupoDisponible
                }
                this.secondFormGroup.patchValue(campos);
                this.creditos = response.data.creditos;

                setTimeout(() => {
                    this.stepper.next();
                }, 1200)

            }
        }, error => {
            this.alert = {
                type: 'error',
                message: 'El empleado no existe!'
            };
            // Show the alert
            this.showAlert = true;
        })
    }



    onSave() {
        if (this.thirdFormGroup.valid) {
            const {montoConsumo, ...form} = this.thirdFormGroup.getRawValue();
            const { idCredito, idTrabajador } = this.secondFormGroup.getRawValue();

            console.log(idCredito)

            const createData = {
                idCredito: idCredito.id,
                idTrabajador,
                montoConsumo: Number(montoConsumo),
                ...form
            }
            console.log(createData)

            const dialog = this.fuseService.open({
                ...guardar
            });

            dialog.afterClosed().subscribe((response) => {
                if (response === 'confirmed') {
                    this.detalleConsumo.postDetalle(createData).subscribe((res) => {
                        console.log(res)
                        // this.estadosDatosService.stateGrid.next(true);
                        this.toasService.toasAlertWarn({
                            message: 'Registro creado con exito!',
                            actionMessage: 'Cerrar',
                            duration: 3000
                        })
                        this.getResumenCompra(idTrabajador)
                        //this.router.navigate(['/pages/gestion-creditos/creditos/'])
                    })
                }
            })
        }
    }

    getResumenCompra(id) {
        this.subscription$ = this.detalleConsumo.getResumen(id).subscribe((response) => {
            if (response) {
                console.log(response)
                this.detaleConsumo = response.data;
                this.stepper.next();
            }
        })
    }

    private createForm() {
        this.firstFormGroup = this.fb.group({
            idTipoDoc: ['', Validators.required],
            numDocumento: ['', Validators.required]
        });

        this.secondFormGroup = this.fb.group({
            numDoc: ['', Validators.required],
            primerNombre: ['', Validators.required],
            segundoNombre:  ['', Validators.required],
            primerApellido:  ['', Validators.required],
            segundoApellido:  ['', Validators.required],
            idTrabajador: [''],
            correo: ['', Validators.required],
            idCredito: ['', Validators.required],
        });

        this.thirdFormGroup = this.fb.group({
            cantidadCuotas: ['', [Validators.required]],
            montoConsumo: ['', [Validators.required] ],
            numeroFactura: ['', Validators.required],
            detalleCompra: ['', Validators.required],
            idMunicipio: ['', Validators.required],
            idTipoConsumo: ['', Validators.required],
            idCuentaBancaria: ['', Validators.required],
            cuentaDestino: ['', Validators.required],
        })
    }

    protected readonly focus = focus;
    protected readonly FormatoOptionsPipe = FormatoOptionsPipe;
}

export function isTenAsync(control: AbstractControl):
    Observable<ValidationErrors | null> {
    const v: number = control.value;
    if (v !== 10) {
        // Emit an object with a validation error.
        return of({ 'notTen': true, 'requiredValue': 10 });
    }
    // Emit null, to indicate no error occurred.
    return of(null);
}

export function validateNumbers(valoraComparar: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {

        const value = control.value;
        console.log(valoraComparar)

        if (value > valoraComparar) {
            return {notEqual: true}
        }
        return null;

    };

}
