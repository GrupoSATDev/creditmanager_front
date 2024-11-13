import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { TasasInteresService } from '../../../../core/services/tasas-interes.service';
import { guardar } from '../../../../core/constant/dialogs';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { DatePipe } from '@angular/common';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { SwalService } from '../../../../core/services/swal.service';
import { MatSlideToggle } from '@angular/material/slide-toggle';
const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-tasas',
  standalone: true,
    imports: [
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatSuffix,
        MatSlideToggle,
        NgxMaskDirective,
    ],
  templateUrl: './form-tasas.component.html',
  styleUrl: './form-tasas.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        provideNgxMask(maskConfig)
    ],
})
export class FormTasasComponent implements OnInit{
    private fb = inject(FormBuilder);
    public form: FormGroup;
    public dialogRef = inject(MatDialogRef<FormTasasComponent>);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public toasService = inject(ToastAlertsService);
    public _matData = inject(MAT_DIALOG_DATA);
    private datePipe = inject(DatePipe);

    private tasasService = inject(TasasInteresService);
    private swalService = inject(SwalService);

    ngOnInit(): void {
        this.createForm();
        const dialogData = this._matData;
        if (dialogData.edit) {
            const data = dialogData.data;
            const {estado, vigencia, ...form} = data;
            const vigenciaConvert = new Date (vigencia);
            vigenciaConvert.setMinutes(vigenciaConvert.getMinutes() + vigenciaConvert.getTimezoneOffset())
            this.form.patchValue({
                estado: estado == 'Activo' ? true : false,
                vigencia: vigenciaConvert,
                ...form
            });
        }

    }

    onSave() {
        if (this.form.valid) {
            if (!this._matData.edit) {
                const data = this.form.getRawValue();
                const {porcentaje,  vigencia, ...form} = data;
                let fecha = this.datePipe.transform(vigencia, `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`);
                const createData = {
                    vigencia: fecha,
                    porcentaje: Number(porcentaje /  100),
                    ...form
                }
                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.tasasService.postTasas(createData).subscribe((res) => {
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
                const {porcentaje, vigencia, ...form} = data;
                let fecha = this.datePipe.transform(vigencia, `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`);
                const createData = {
                    vigencia: fecha,
                    porcentaje: Number(porcentaje),
                    ...form
                }

                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.tasasService.putTasas(createData).subscribe((res) => {
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

    private createForm() {
        this.form = this.fb.group({
            id: [null],
            porcentaje: [''],
            vigencia: [''],
            nombre: [''],
            estado: ['true'],
        })
    }

    closeDialog() {
        this.dialogRef.close();
    }

}
