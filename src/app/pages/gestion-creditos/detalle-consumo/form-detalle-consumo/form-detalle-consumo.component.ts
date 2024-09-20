import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AsyncPipe, DatePipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { TiposDocumentosService } from '../../../../core/services/tipos-documentos.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { EmpleadosService } from '../../../../core/services/empleados.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FuseAlertComponent, FuseAlertType } from '../../../../../@fuse/components/alert';
import { fuseAnimations } from '../../../../../@fuse/animations';
import { LocacionService } from '../../../../core/services/locacion.service';
import { Observable } from 'rxjs';
import { guardar } from '../../../../core/constant/dialogs';
import { DetalleConsumoService } from '../../../../core/services/detalle-consumo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-detalle-consumo',
  animations: fuseAnimations,
  standalone: true,
    imports: [
        MatStepper,
        MatStep,
        FormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        MatButton,
        MatStepperNext,
        AsyncPipe,
        MatOption,
        MatSelect,
        NgForOf,
        NgIf,
        ReactiveFormsModule,
        MatStepLabel,
        CdkScrollable,
        MatStepperPrevious,
        FuseAlertComponent,
        JsonPipe,
    ],
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe
    ],
  templateUrl: './form-detalle-consumo.component.html',
  styleUrl: './form-detalle-consumo.component.scss'
})
export class FormDetalleConsumoComponent implements OnInit, OnDestroy{
    private tiposDocumentosService = inject(TiposDocumentosService);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public toasService = inject(ToastAlertsService);
    private empleadosServices = inject(EmpleadosService)
    private datePipe = inject(DatePipe);
    private router = inject(Router);

    private fb = inject(FormBuilder);
    private _locacionService = inject(LocacionService);
    private detalleConsumo = inject(DetalleConsumoService);
    public departamentos$ = this._locacionService.getDepartamentos();
    public municipios$: Observable<any>;
    @ViewChild('stepper') stepper!: MatStepper;

    public firstFormGroup: FormGroup;
    public secondFormGroup: FormGroup;
    public thirdFormGroup: FormGroup;
    showAlert: boolean = false;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };

    public tiposDocumentos$ = this.tiposDocumentosService.getTiposDocumentos();
    public creditos = [];

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.createForm();
    }

    getMunicipios(matSelectChange: MatSelectChange) {
        const id = matSelectChange.value;
        this.municipios$ = this._locacionService.getMunicipio(id);
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

            const createData = {
                idCredito,
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
                        this.estadosDatosService.stateGrid.next(true);
                        this.toasService.toasAlertWarn({
                            message: 'Registro creado con exito!',
                            actionMessage: 'Cerrar',
                            duration: 3000
                        })
                        this.router.navigate(['/pages/gestion-creditos/creditos/'])
                    })
                }
            })
        }
    }

    private createForm() {
        this.firstFormGroup = this.fb.group({
            idTipoDoc: ['', Validators.required],
            numDocumento: ['', Validators.required]
        });

        this.secondFormGroup = this.fb.group({
            numDoc: [{value: '', disabled: true}],
            primerNombre: [{value: '', disabled: true}],
            segundoNombre:  [{value: '', disabled: true}],
            primerApellido:  [{value: '', disabled: true}],
            segundoApellido:  [{value: '', disabled: true}],
            idTrabajador: [''],
            correo: [{value: '', disabled: true}],
            idCredito: ['']
        });

        this.thirdFormGroup = this.fb.group({
            cantidadCuotas: [''],
            montoConsumo: [''],
            numeroFactura: [''],
            detalleCompra: [''],
            idMunicipio: [''],
        })
    }

    protected readonly focus = focus;
}
