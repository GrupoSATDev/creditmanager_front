import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatStep, MatStepper, MatStepperNext } from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FuseAlertType } from '../../../../../@fuse/components/alert';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subscription, switchMap } from 'rxjs';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { EmpleadosService } from '../../../../core/services/empleados.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { IConfig, provideNgxMask } from 'ngx-mask';
import { SwalService } from '../../../../core/services/swal.service';
import { guardar } from '../../../../core/constant/dialogs';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { CodigosEstadosSolicitudes } from '../../../../core/enums/estados-solicitudes';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { AesEncryptionService } from '../../../../core/services/aes-encryption.service';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-approve-desembolso',
  standalone: true,
    imports: [
        CdkScrollable,
        MatStepper,
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        MatStep,
        MatStepperNext,
        ReactiveFormsModule,
    ],
  templateUrl: './form-approve-desembolso.component.html',
  styleUrl: './form-approve-desembolso.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        provideNgxMask(maskConfig)
    ],
})
export class FormApproveDesembolsoComponent implements OnInit, OnDestroy {
    fuseService = inject(FuseConfirmationService);
    public secondFormGroup: FormGroup;
    private router = inject(Router);
    private fb = inject(FormBuilder);
    private subscription$: Subscription;
    @ViewChild('stepper') stepper!: MatStepper;
    private activatedRoute = inject(ActivatedRoute);
    private solicitudService = inject(SolicitudesService);
    private empleadosServices = inject(EmpleadosService);
    private currencyPipe = inject(CurrencyPipe);
    private swalService = inject(SwalService);
    private errorHandlerService = inject(ErrorHandlerService)
    private aesEncriptService = inject(AesEncryptionService);

    showAlert: boolean = false;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.createForm();

        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.getSolicitud(id);
    }

    private getSolicitud(id) {
        this.subscription$ = this.solicitudService.getSolicitud(id).pipe(
            switchMap((response) => {
                const dataForm = {
                    idTipoDoc: response.data.trabajador.idTipoDoc,
                    numDocumento: response.data.trabajador.numDoc
                }
                return this.empleadosServices.getEmpleadoParams(dataForm);
            })
        ).subscribe((response) => {
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
                    credito: response.data.creditos[0].numCredito + ' - ' + this.currencyPipe.transform(this.aesEncriptService.decrypt(response.data.creditos[0].cupoDisponible), 'USD', 'symbol', '1.2-2'),
                    idCredito: response.data.creditos[0].id,
                    numCuentaBancaria: response.data.numCuentaBancaria,
                    idTipoCuenta: response.data.idTipoCuenta,
                    id
                }
                this.secondFormGroup.patchValue(campos);
            }

        }, error => {
            this.alert = {
                type: 'error',
                message: 'El trabajador no existe!'
            };
            // Show the alert
            this.showAlert = true;
        })
    }

    onApprove() {
        if (this.secondFormGroup.valid) {

            const { id, idCredito, idTrabajador } = this.secondFormGroup.getRawValue();

            const createData = {
                id,
                idEstado: CodigosEstadosSolicitudes.APROBADA
            }

            const dialog = this.fuseService.open({
                ...guardar
            });

            dialog.afterClosed().subscribe((response) => {
                if (response === 'confirmed') {
                    this.solicitudService.patchSolicitudDesembolso(createData).subscribe((response) => {
                        this.swalService.ToastAler({
                            icon: 'success',
                            title: 'Registro Creado o Actualizado con Exito.',
                            timer: 4000,
                        })
                        this.router.navigate(['pages/gestion-creditos/desembolsos']);
                    }, error => {
                        this.errorHandlerService.errorHandler(error);
                    })

                }


            })

        }

    }

    onRechazar() {
        if (this.secondFormGroup.valid) {

            const { id, idCredito, idTrabajador } = this.secondFormGroup.getRawValue();

            const createData = {
                id,
                idEstado: CodigosEstadosSolicitudes.RECHAZADA
            }

            const dialog = this.fuseService.open({
                ...guardar
            });

            dialog.afterClosed().subscribe((response) => {
                if (response === 'confirmed') {
                    this.solicitudService.patchSolicitudDesembolso(createData).subscribe((response) => {
                        this.swalService.ToastAler({
                            icon: 'success',
                            title: 'Registro Creado o Actualizado con Exito.',
                            timer: 4000,
                        })
                        this.router.navigate(['pages/gestion-creditos/desembolsos']);
                    }, error => {
                        this.errorHandlerService.errorHandler(error);
                    })

                }

            })



        }

    }

    cerrar() {
        this.router.navigate(['/pages/gestion-creditos/desembolsos'])
    }

    private createForm() {
        this.secondFormGroup = this.fb.group({
            numDoc: ['', Validators.required],
            primerNombre: ['', Validators.required],
            segundoNombre:  [''],
            primerApellido:  ['', Validators.required],
            segundoApellido:  [''],
            idTrabajador: [''],
            correo: ['', Validators.required],
            credito: ['', Validators.required],
            idCredito: ['', Validators.required],
            numCuentaBancaria: [''],
            idTipoCuenta: [''],
            id: ['']
        });
    }

}
