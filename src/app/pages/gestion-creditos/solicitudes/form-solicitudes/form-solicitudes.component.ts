import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { guardar } from '../../../../core/constant/dialogs';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { MatStep, MatStepper, MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';
import { EmpleadosService } from '../../../../core/services/empleados.service';
import { map, Subscription } from 'rxjs';

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

    initialInfoForm!: FormGroup;
    firstFormGroup!: FormGroup;
    secondFormGroup!: FormGroup;

    private solicitudService: SolicitudesService = inject(SolicitudesService)

    ngOnInit(): void {
        this.initialInfoForm = this.fb.group({
            // No es obligatorio tener validaciones aquí si solo es lectura
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
            observacion: ['', [Validators.required]],
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

    onSave() {
        if (this.secondFormGroup.valid) {
            if (!this._matData.edit) {
                const data = this.secondFormGroup.getRawValue();
                const {cupo,  ...form} = data;
                const createData = {
                    cupo: Number(cupo),
                    ...form
                }
                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.solicitudService.postSolicitudes(createData).subscribe((res) => {
                            console.log(res)
                            this.estadosDatosService.stateGrid.next(true);
                            this.toasService.toasAlertWarn({
                                message: 'Registro creado con exito!',
                                actionMessage: 'Cerrar',
                                duration: 3000
                            })
                            this.closeDialog();
                        })
                    }else {
                        this.closeDialog();
                    }
                })
            }else {
                const data = this.form.getRawValue();
                const {cupo,  ...form} = data;
                const createData = {
                    cupo: Number(cupo),
                    ...form
                }

                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.solicitudService.putSolicitudes(createData).subscribe((res) => {
                            this.estadosDatosService.stateGrid.next(true);
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
