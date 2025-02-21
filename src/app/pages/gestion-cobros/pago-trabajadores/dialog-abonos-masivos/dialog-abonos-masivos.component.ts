import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { SwalService } from '../../../../core/services/swal.service';
import { PagoTrabajadoresService } from '../../../../core/services/pago-trabajadores.service';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-dialog-abonos-masivos',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        NgxMaskDirective,
        ReactiveFormsModule,
        MatDialogClose,
    ],
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        provideNgxMask(maskConfig)
    ],
  templateUrl: './dialog-abonos-masivos.component.html',
  styleUrl: './dialog-abonos-masivos.component.scss'
})
export class DialogAbonosMasivosComponent  implements OnInit{
    public dialogRef = inject(MatDialogRef<DialogAbonosMasivosComponent>);
    public _matData = inject(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);
    public form: FormGroup;
    public estadosDatosService = inject(EstadosDatosService);
    private pagoTrabajadoresService = inject(PagoTrabajadoresService);
    private swalService = inject(SwalService);

    ngOnInit(): void {
        this.createForm();
        const data = this._matData.data;
        console.log(data);
        this.form.patchValue({
            valorRecibido: parseFloat(data.total.replace(/[\$,]/g, ''))
        });
    }

    closeDialog() {
        this.dialogRef.close();
    }

    private createForm() {
        this.form = this.fb.group({
            comprobante: ['', Validators.required],
            valor: [''],
            idPagoTrabajador: [''],
        });
    }

    onAbono() {
        if(this.form.valid) {
            const dataInput = this._matData.data;
            const data = this.form.getRawValue();

            const {valor, ...form} = data;

            const createData = {
                idPagoTrabajador: dataInput.id,
                valor:  parseFloat(valor),
                ...form
            }

            this.pagoTrabajadoresService.pagoTrabajadoresAbono(createData).subscribe((response) => {
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

        }

    }

}
