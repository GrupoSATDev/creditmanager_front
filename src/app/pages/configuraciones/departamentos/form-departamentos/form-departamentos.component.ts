import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { guardar } from '../../../../core/constant/dialogs';
import { LocacionService } from '../../../../core/services/locacion.service';
import { SwalService } from '../../../../core/services/swal.service';

@Component({
  selector: 'app-form-departamentos',
  standalone: true,
    imports: [
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
    ],
  templateUrl: './form-departamentos.component.html',
  styleUrl: './form-departamentos.component.scss'
})
export class FormDepartamentosComponent implements OnInit{
    private fb = inject(FormBuilder);
    public form: FormGroup;
    private _locacionService = inject(LocacionService);
    public dialogRef = inject(MatDialogRef<FormDepartamentosComponent>);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public toasService = inject(ToastAlertsService);
    public _matData = inject(MAT_DIALOG_DATA);
    private swalService = inject(SwalService);

    ngOnInit(): void {
        this.createForm();
        const dialogData = this._matData;
        if (dialogData.edit) {
            const data = dialogData.data;
            this.form.patchValue(data);
        }
    }

    onSave(): void {
        if (this.form.valid) {
            if (!this._matData.edit) {
                const data = this.form.getRawValue();
                const {codigoDane, ...form} = data;
                const createData = {
                    codigoDane: Number(codigoDane),
                    ...form
                }
                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this._locacionService.postDepartamento(createData).subscribe((res) => {
                            console.log(res)
                            this.estadosDatosService.stateGrid.next(true);
                            this.swalService.ToastAler({
                                icon: 'success',
                                title: 'Registro creado con exito!',
                                timer: 4000,
                            })
                            this.closeDialog();
                        }, error => {
                            this.swalService.ToastAler({
                                icon: 'error',
                                title: 'Ha ocurrido un problema al crear el registro!',
                                timer: 4000,
                            })
                        })
                    }else {
                        this.closeDialog();
                    }
                })
            }else {
                const data = this.form.getRawValue();
                const {codigoDane, ...form} = data;
                const createData = {
                    codigoDane: Number(codigoDane),
                    ...form
                }

                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this._locacionService.putDepartamento(createData).subscribe((res) => {
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
                                title: 'Ha ocurrido un problema al actualizar el registro!',
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
            codigoDane: [''],
            nombre: [''],
        })
    }

    closeDialog() {
        this.dialogRef.close();
    }


}
