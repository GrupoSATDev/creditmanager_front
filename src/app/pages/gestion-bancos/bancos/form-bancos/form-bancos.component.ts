import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SwalService } from '../../../../core/services/swal.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { BancosService } from '../../../../core/services/bancos.service';
import { guardar } from '../../../../core/constant/dialogs';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-form-bancos',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        MatSlideToggle,
    ],
  templateUrl: './form-bancos.component.html',
  styleUrl: './form-bancos.component.scss'
})
export class FormBancosComponent implements OnInit{
    private fb = inject(FormBuilder);
    public form: FormGroup;
    public dialogRef = inject(MatDialogRef<FormBancosComponent>);
    public estadosDatosService = inject(EstadosDatosService);
    public _matData = inject(MAT_DIALOG_DATA);
    private swalService = inject(SwalService);
    public fuseService = inject(FuseConfirmationService);
    private bancosService = inject(BancosService);

    ngOnInit(): void {
        this.createForm();
        const dialogData = this._matData;
        if (dialogData.edit) {
            const { estado, ...form } = dialogData.data;
            this.form.patchValue({
                ...form,
                estado: estado == 'Activo' ? true : false,
            });
        }
    }

    onSave(): void {
        if (this.form.valid) {
            if (!this._matData.edit) {
                const data = this.form.getRawValue();

                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.bancosService.postBancos(data).subscribe((res) => {
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
                        this.bancosService.putBancos(data).subscribe((res) => {
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
            nombre: [''],
            estado: [true],
        })
    }

    closeDialog() {
        this.dialogRef.close();
    }

}
