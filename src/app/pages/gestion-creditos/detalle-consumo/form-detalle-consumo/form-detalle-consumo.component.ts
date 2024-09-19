import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatOption, MatSelect } from '@angular/material/select';
import { TiposDocumentosService } from '../../../../core/services/tipos-documentos.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { EmpleadosService } from '../../../../core/services/empleados.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FuseAlertComponent, FuseAlertType } from '../../../../../@fuse/components/alert';

@Component({
  selector: 'app-form-detalle-consumo',
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
    private fb = inject(FormBuilder);
    @ViewChild('stepper') stepper!: MatStepper;

    public firstFormGroup: FormGroup;
    public secondFormGroup: FormGroup;
    showAlert: boolean = false;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };

    public tiposDocumentos$ = this.tiposDocumentosService.getTiposDocumentos();

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.createForm();
    }

    public onSearch() {
        const data = this.firstFormGroup.getRawValue();
        this.empleadosServices.getEmpleadoParams(data).subscribe((respone) => {
            console.log(respone);
            if (respone) {
                this.showAlert = false;
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

    private createForm() {
        this.firstFormGroup = this.fb.group({
            idTipoDoc: ['', Validators.required],
            numDocumento: ['', Validators.required]
        });

        this.secondFormGroup = this.fb.group({});
    }

    protected readonly focus = focus;
}
