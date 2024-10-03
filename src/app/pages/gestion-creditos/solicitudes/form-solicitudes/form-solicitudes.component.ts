import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { guardar } from '../../../../core/constant/dialogs';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { MatStep, MatStepper, MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';
import { EmpleadosService } from '../../../../core/services/empleados.service';
import { map, Subscription } from 'rxjs';
import { TerminosCondicionesComponent } from '../terminos-condiciones/terminos-condiciones.component';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { IConfig, NgxMaskDirective, provideEnvironmentNgxMask, provideNgxMask } from 'ngx-mask';
import { tiposSolicitudes } from '../../../../core/constant/tiposSolicitud';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-solicitudes',
  standalone: true,
    imports: [
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        MatStepper,
        MatStep,
        MatStepperPrevious,
        MatStepperNext,
        TerminosCondicionesComponent,
        NgClass,
        NgIf,
        MatError,
        NgxMaskDirective,
        AsyncPipe,
        MatOption,
        MatSelect,
        NgForOf,
    ],
    providers: [
        provideNgxMask(maskConfig)
    ],
    templateUrl: './form-solicitudes.component.html',
    styleUrl: './form-solicitudes.component.scss'
})
export class FormSolicitudesComponent implements OnInit{
    private fb = inject(FormBuilder);
    public form: FormGroup;
    public dialogRef = inject(MatDialogRef<FormSolicitudesComponent>);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public toasService = inject(ToastAlertsService);
    private empleadoService = inject(EmpleadosService);
    public _matData = inject(MAT_DIALOG_DATA);
    public subcripstion$: Subscription;
    aceptoTerminos = false;
    matDisabled = false;
    tipoSolicitud = tiposSolicitudes

    initialInfoForm!: FormGroup;
    firstFormGroup!: FormGroup;
    secondFormGroup!: FormGroup;

    private solicitudService: SolicitudesService = inject(SolicitudesService)

    ngOnInit(): void {
        this.initialInfoForm = this.fb.group({
            check: ['', Validators.required]
        });

        this.firstFormGroup = this.fb.group({
            nombreCompleto: [{value: '', disabled: true}, Validators.required],
            numDoc: [{value: '', disabled: true}, Validators.required],
            direccion: [{value: '', disabled: true}, Validators.required],
            idMunicipio: [{value: '', disabled: true}, Validators.required],
            correo: [{value: '', disabled: true}, Validators.required],
        });

        this.secondFormGroup = this.fb.group({
            cupo: ['', [Validators.required]],
            observacion: [''],
            idTipoSolicitud: ['', [Validators.required]],
        });
        this.createForm();
        const dialogData = this._matData;
        if (dialogData.edit) {
            const data = dialogData.data;
            this.form.patchValue(data);
        }
        const id = 'c6d6b3a7-799f-42eb-8868-e069df989b11'
        this.subcripstion$ = this.empleadoService.getEmpleado(id).pipe(
            map((response) => {
                response.data.nombreCompleto = response.data.primerNombre + " " + response.data.segundoNombre + " " + response.data.primerApellido + " " + response.data.segundoApellido
                return response
            })
        ).subscribe((response) => {
            const data = response.data;
            const campos = {
                nombreCompleto: response.data.nombreCompleto,
                numDoc: response.data.numDoc,
                direccion: response.data.direccion,
                idMunicipio: response.data.nombreMunicipio,
                correo: response.data.correo
            }
            this.firstFormGroup.patchValue(campos);
        })

    }

    onAceptarTerminos(aceptado: boolean) {
        this.aceptoTerminos = aceptado;
        if (aceptado) {
            this.initialInfoForm.patchValue({check: true})
        }else {
            this.initialInfoForm.patchValue({check: ''})
        }
    }

    onSave() {
        if (this.secondFormGroup.valid) {
            if (!this._matData.edit) {
                const data = this.secondFormGroup.getRawValue();
                const {cupo, cantCuotas,  ...form} = data;
                const createData = {
                    cupo: Number(cupo),
                    cantCuotas: Number(cantCuotas),
                    ...form
                }
                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.solicitudService.postSolicitudes(createData).subscribe((res) => {
                            console.log(res)
                            console.log('Edicion')
                            this.estadosDatosService.stateGridSolicitudes.next({state: true, tab: 2});
                            this.toasService.toasAlertWarn({
                                message: 'Registro creado con exito!',
                                actionMessage: 'Cerrar',
                                duration: 3000
                            })
                            this.closeDialog();
                        }, error => {
                            this.toasService.toasAlertWarn({
                                message: error.error.errorMenssages[0],
                                actionMessage: 'Cerrar',
                                duration: 6000
                            })
                        })
                    }else {
                        this.closeDialog();
                    }
                })
            }else {
                const data = this.form.getRawValue();
                const {cupo, cantCuotas,  ...form} = data;
                const createData = {
                    cupo: Number(cupo),
                    cantCuotas: Number(cantCuotas),
                    ...form
                }

                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.solicitudService.putSolicitudes(createData).subscribe((res) => {
                            this.estadosDatosService.stateGridSolicitudes.next({state: true, tab: 2});
                            console.log('Guardado')
                            this.toasService.toasAlertWarn({
                                message: 'Registro actualizado con exito!',
                                actionMessage: 'Cerrar',
                                duration: 3000
                            })
                            this.closeDialog();
                        })
                    }else {
                        this.closeDialog();
                    }
                })

            }

        }
    }

    private createForm() {
        this.form = this.fb.group({
            id: [null],
            cupo: [''],
            observacion: [''],
        })
    }

    closeDialog() {
        this.dialogRef.close();
    }

}
