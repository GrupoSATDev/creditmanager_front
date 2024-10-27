import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { BancosService } from '../../../../core/services/bancos.service';
import { Observable, tap } from 'rxjs';
import { guardar } from '../../../../core/constant/dialogs';
import { CuentasBancariasService } from '../../../../core/services/cuentas-bancarias.service';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { TipoCuentasService } from '../../../../core/services/tipo-cuentas.service';

const maskConfig: Partial<IConfig> = {
    validation: false,
};


@Component({
  selector: 'app-form-cuentas',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        MatOption,
        MatSelect,
        NgForOf,
        NgxMaskDirective,
        NgIf,
        AsyncPipe,
    ],
    providers: [
        provideNgxMask(maskConfig)
    ],
  templateUrl: './form-cuentas.component.html',
  styleUrl: './form-cuentas.component.scss'
})
export class FormCuentasComponent implements OnInit{
    private fb = inject(FormBuilder);
    public form: FormGroup;
    public dialogRef = inject(MatDialogRef<FormCuentasComponent>);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public toasService = inject(ToastAlertsService);
    public bancosService = inject(BancosService);
    private cuentasBancariasService = inject(CuentasBancariasService);
    private tipoCuentasService = inject(TipoCuentasService);
    public tipoCuentas$  = this.tipoCuentasService.getTipoCuentas().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idTipoCuenta').setValue(valorSelected[0].id)
            }

        })
    )
    public _matData = inject(MAT_DIALOG_DATA);
    public bancos$: Observable<any> = this.bancosService.getBancos().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idBanco').setValue(valorSelected[0].id)
            }

        })
    )

    ngOnInit(): void {
        this.createForm();
        const dialogData = this._matData;
        if (dialogData.edit) {
            const data = dialogData.data;
            this.form.patchValue(data);
        }

    }

    private createForm() {
        this.form = this.fb.group({
            id: [null],
            idTipoCuenta: [''],
            idBanco: [''],
            numeroCuenta: [''],
            descripcion: [''],
        })
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
                        this.cuentasBancariasService.postCuentas(data).subscribe((res) => {
                            console.log(res)
                            this.estadosDatosService.stateGrid.next(true);
                            this.toasService.toasAlertWarn({
                                message: 'Registro Creado o Actualizado con Exito.',
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

                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.cuentasBancariasService.putCuentas(data).subscribe((res) => {
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

    closeDialog() {
        this.dialogRef.close();
    }

}
