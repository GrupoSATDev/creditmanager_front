import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { guardar } from '../../../../core/constant/dialogs';
import { TiposDocumentosService } from '../../../../core/services/tipos-documentos.service';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { SwalService } from '../../../../core/services/swal.service';

@Component({
  selector: 'app-form-tipos-documentos',
  standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        MatButton,
    ],
  templateUrl: './form-tipos-documentos.component.html',
  styleUrl: './form-tipos-documentos.component.scss'
})
export class FormTiposDocumentosComponent implements  OnInit{
    private fb = inject(FormBuilder);
    public form: FormGroup;
    public dialogRef = inject(MatDialogRef<FormTiposDocumentosComponent>);
    public fuseService = inject(FuseConfirmationService);
    public toasService = inject(ToastAlertsService);
    public estadosDatosService = inject(EstadosDatosService);
    public tiposDocumentoService = inject(TiposDocumentosService);
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

    onSave() {
        if (this.form.valid) {
            if (!this._matData.edit) {
                const data = this.form.getRawValue();

                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.tiposDocumentoService.postDocumentos(data).subscribe((res) => {
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
                        this.tiposDocumentoService.putDocumentos(data).subscribe((res) => {
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
            codigo: [''],
            nombre: [''],
        })
    }

    closeDialog() {
        this.dialogRef.close();
    }

}
