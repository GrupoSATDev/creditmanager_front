import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { guardar } from '../../../../core/constant/dialogs';
import { CapitalInversionService } from '../../../../core/services/capital-inversion.service';
import { SwalService } from '../../../../core/services/swal.service';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-capital-inversion',
  standalone: true,
    imports: [
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        NgxMaskDirective,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatSuffix,
    ],
  templateUrl: './form-capital-inversion.component.html',
  styleUrl: './form-capital-inversion.component.scss',
  providers: [
      { provide: DateAdapter, useClass: DateAdapterService },
      { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
      DatePipe,
        provideNgxMask(maskConfig)
  ],
})
export class FormCapitalInversionComponent implements OnInit{
    private fb = inject(FormBuilder);
    public form: FormGroup;
    public dialogRef = inject(MatDialogRef<FormCapitalInversionComponent>);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public toasService = inject(ToastAlertsService);
    private capitalService = inject(CapitalInversionService);
    public _matData = inject(MAT_DIALOG_DATA);
    private swalService = inject(SwalService);
    private datePipe = inject(DatePipe);
    private readonly destroyedRef = inject(DestroyRef);
    public currentValuePorcentaje: any;

    ngOnInit(): void {
        this.createForm();
        const dialogData = this._matData;
        if (dialogData.edit) {
            const data = dialogData.data;
            this.getCapital(data.id)
        }

    }

    onSave() {
        if (this.form.valid) {
            if (!this._matData.edit) {
                const data = this.form.getRawValue();
                const {rubroInversion, plazoPagoInversor, tasaInteresInversor,  ...form} = data;
                let plazoPagoInversorTransform = this.datePipe.transform(plazoPagoInversor, `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`);
                const createData = {
                    rubroInversion: Number(rubroInversion),
                    plazoPagoInversor: plazoPagoInversorTransform,
                    tasaInteresInversor: Number(tasaInteresInversor / 100),
                    ...form
                }
                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.capitalService.postCapitales(createData).pipe(
                            takeUntilDestroyed(this.destroyedRef)
                        ).subscribe((res) => {
                            console.log(res)
                            this.estadosDatosService.stateGrid.next(true);
                            this.swalService.ToastAler({
                                icon: 'success',
                                title: 'Registro Creado o Actualizado con Exito.',
                                timer: 4000,
                            })
                            this.closeDialog();
                        }, error => {
                            this.swalService.ToastAler({
                                icon: 'error',
                                title: 'Ha ocurrido un error al crear el registro!',
                                timer: 4000,
                            })
                        })
                    }else {
                        this.closeDialog();
                    }
                })
            }else {
                const data = this.form.getRawValue();
                const {rubroInversion, plazoPagoInversor, tasaInteresInversor,  ...form} = data;
                let plazoPagoInversorTransform = this.datePipe.transform(plazoPagoInversor, `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`);
                const createData = {
                    rubroInversion: Number(rubroInversion),
                    plazoPagoInversor: plazoPagoInversorTransform,
                    tasaInteresInversor: this.currentValuePorcentaje == tasaInteresInversor ? tasaInteresInversor : Number(tasaInteresInversor / 100),
                    ...form
                }

                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.capitalService.putCapitales(createData).pipe(
                            takeUntilDestroyed(this.destroyedRef)
                        ).subscribe((res) => {
                            this.estadosDatosService.stateGrid.next(true);
                            this.swalService.ToastAler({
                                icon: 'success',
                                title: 'Registro actualizado con exito!',
                                timer: 4000,
                            })
                            this.closeDialog();
                        }, error => {
                            this.swalService.ToastAler({
                                icon: 'error',
                                title: 'Ha ocurrido un error al actualizar el registro!',
                                timer: 4000,
                            })
                        })
                    }else {
                        this.closeDialog();
                    }
                })

            }

        }
    }

    private getCapital(id) {
        this.capitalService.getCapital(id).pipe(
            takeUntilDestroyed(this.destroyedRef)
        ).subscribe((response) => {
            if (response) {
                const fechaConver = new Date(response.data.plazoPagoInversor);
                fechaConver.setMinutes(fechaConver.getMinutes() + fechaConver.getTimezoneOffset());
                const campos = {
                    id: response.data.id,
                    nombreInversor: response.data.nombreInversor,
                    rubroInversion: response.data.rubroInversion,
                    detalleInversion: response.data.detalleInversion,
                    tasaInteresInversor: response.data.tasaInteresInversor,
                    plazoPagoInversor: fechaConver,
                }
                this.form.patchValue(campos);
                this.currentValuePorcentaje = {...this.form.get('tasaInteresInversor')}
            }
        })
    }

    private createForm() {
        this.form = this.fb.group({
            id: [null],
            nombreInversor: [''],
            rubroInversion: [''],
            detalleInversion: [''],
            tasaInteresInversor: [''],
            plazoPagoInversor: [''],
        })
    }

    closeDialog() {
        this.dialogRef.close();
    }

}
