import { Component, inject, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule, ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { PagoTrabajadoresService } from '../../../../core/services/pago-trabajadores.service';
import { SwalService } from '../../../../core/services/swal.service';

const maskConfig: Partial<IConfig> = {
    validation: false,
};


@Component({
  selector: 'app-dialog-abono-individual',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatError,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        NgIf,
        NgxMaskDirective,
        MatDialogClose,
        ReactiveFormsModule,
    ],
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        provideNgxMask(maskConfig)
    ],
  templateUrl: './dialog-abono-individual.component.html',
  styleUrl: './dialog-abono-individual.component.scss'
})
export class DialogAbonoIndividualComponent implements OnInit{
    public dialogRef = inject(MatDialogRef<DialogAbonoIndividualComponent>);
    public _matData = inject(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);
    public form: FormGroup;
    public estadosDatosService = inject(EstadosDatosService);
    private pagoTrabajadoresService = inject(PagoTrabajadoresService);
    private swalService = inject(SwalService);

    ngOnInit(): void {
        this.createForm();
        const data = this._matData.data;
        const totalNumber  = typeof data.total  === 'string' ? parseFloat(data.total.replace(/[\$,]/g, '')) : typeof data.total  === 'number' ? data.total : 0;
        const totalAbonoNumber = typeof data.totalAbono  === 'string' ?  parseFloat(data.totalAbono.replace(/[\$,]/g, '')) : typeof data.totalAbono  === 'number' ? data.totalAbono : 0;
        this.form.get('valor').setValidators([maxAmountValidator(totalNumber, totalAbonoNumber) , Validators.required]);
        this.form.updateValueAndValidity();
    }

    closeDialog() {
        this.dialogRef.close();
    }

    private createForm() {
        this.form = this.fb.group({
            comprobante: ['', Validators.required],
            valor: ['', Validators.required],
            idPagoTrabajador: [''],
        });
    }

    onAbono() {
        if(this.form.valid) {
            const dataInput = this._matData.data;
            const data = this.form.getRawValue();

            const {valor, comprobante} = data;

            const createData = {
                idPagoTrabajador: dataInput.id,
                valor:  parseFloat(valor),
                comprobante
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

export function maxAmountValidator(total: number, totalAbono: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        const maxValue = total - totalAbono;

        return value >= maxValue ? { maxAmount: { maxValue, actual: value } } : null;
    };
}

