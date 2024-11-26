import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { SwalService } from '../../../../core/services/swal.service';
import { guardar } from '../../../../core/constant/dialogs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CobrosFijosService } from '../../../../core/services/cobros-fijos.service';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-cobro-fijo',
  standalone: true,
    imports: [
        CustomTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatLabel,
        MatSuffix,
        NgxMaskDirective,
        ReactiveFormsModule,
    ],
  templateUrl: './form-cobro-fijo.component.html',
  styleUrl: './form-cobro-fijo.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        provideNgxMask(maskConfig)
    ],
})
export class FormCobroFijoComponent  implements OnInit{
    private fb = inject(FormBuilder);
    public form: FormGroup;
    public dialogRef = inject(MatDialogRef<FormCobroFijoComponent>);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public _matData = inject(MAT_DIALOG_DATA);
    private swalService = inject(SwalService);
    private readonly destroyedRef = inject(DestroyRef);
    private cobrosFijosService: CobrosFijosService = inject(CobrosFijosService);


    ngOnInit(): void {
        this.createForm();
        const dialogData = this._matData;
        if (dialogData.edit) {
            const data = dialogData.data;
            this.getCobro(data.id);
        }

    }

    onSave() {
        if (this.form.valid) {
            if (!this._matData.edit) {
                const data = this.form.getRawValue();

                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.cobrosFijosService.postCobros(data).pipe(
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


                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.cobrosFijosService.putCobros(data).pipe(
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

    private getCobro(id) {
        this.cobrosFijosService.getCobro(id).subscribe((response) => {
            if (response) {
                const data = response.data;
                const campos = {
                    periodo: data.periodo,
                    valorAval: data.valorAval,
                    valorFirmaElectronica: data.valorFirmaElectronica,
                    valorTarjeta: data.valorTarjeta,
                    id: data.id,
                }

                this.form.patchValue(campos);

            }
        })
    }

    private createForm() {
        this.form = this.fb.group({
            id: [null],
            valorAval: [''],
            valorFirmaElectronica: [''],
            valorTarjeta: [''],
            periodo: [''],
        })
    }

    closeDialog() {
        this.dialogRef.close();
    }

}
