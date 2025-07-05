import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn, Validators,
} from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { SwalService } from '../../../../core/services/swal.service';
import { CreditoConsumosService } from '../../../../core/services/credito-consumos.service';
import { AesEncryptionService } from '../../../../core/services/aes-encryption.service';
import { Router } from '@angular/router';
const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
    selector: 'app-dialog-credito-consumo-pagos',
    standalone: true,
    imports: [
        MatButton,
        MatError,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        NgIf,
        NgxMaskDirective,
        ReactiveFormsModule,
        MatDialogClose,
    ],
    templateUrl: './dialog-credito-consumo-pagos.component.html',
    styleUrl: './dialog-credito-consumo-pagos.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        provideNgxMask(maskConfig),
    ],
})
export class DialogCreditoConsumoPagosComponent implements OnInit {
    public dialogRef = inject(MatDialogRef<DialogCreditoConsumoPagosComponent>);
    public _matData = inject(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);
    public form: FormGroup;
    public estadosDatosService = inject(EstadosDatosService);
    private swalService = inject(SwalService);
    private creditoConsumoService = inject(CreditoConsumosService);
    public cupoAprobado: FormControl = new FormControl('');
    public aesEncriptService = inject(AesEncryptionService);
    private router  = inject(Router);

    ngOnInit(): void {
        this.createForm();
        const data = {...this._matData.data };

        if (data.cupoConsumido) {
            data.cupoConsumido = this.aesEncriptService.decrypt(data.cupoConsumido);
        }

        console.log(data)

        const cupoConsumido =
            typeof data.cupoConsumido === 'string'  ? parseFloat(data.cupoConsumido.replace(/[\$,]/g, ''))  : typeof data.cupoConsumido === 'number'  ? data.cupoConsumido  : 0;
        this.form.patchValue({idCreditoConsumo: data.id});
        this.form.get('valorPago').setValidators([ maxAmountValidator(cupoConsumido), Validators.required, ]);
        this.form.updateValueAndValidity();
    }

    closeDialog() {
        this.dialogRef.close();
    }

    private createForm() {
        this.form = this.fb.group({
            idCreditoConsumo: ['', Validators.required],
            comprobante: ['', Validators.required],
            valorPago: ['', Validators.required],
        });
    }

    onGuardar(): void {
        if (this.form.valid) {
            const form = this.form.getRawValue();


                this.creditoConsumoService.postPagosCreditos(form).subscribe(
                    (response) => {
                        this.estadosDatosService.stateGrid.next(true);
                        this.swalService.ToastAler({
                            icon: 'success',
                            title: 'Registro Creado o Actualizado con Exito.',
                            timer: 4000,
                        });
                        this.closeDialog();
                        this.router.navigate(['/pages/gestion-creditos/credito-consumos']);
                    },
                    (error) => {
                        this.swalService.ToastAler({
                            icon: 'error',
                            title: 'Ha ocurrido un error al crear el registro!',
                            timer: 4000,
                        });
                    }
                );
            }
        }
}

export function maxAmountValidator(cupoConsumido: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const nuevoCupo = control.value;

        return nuevoCupo > cupoConsumido ? {
            maxAmount: { cupoConsumido }
        }
        : null;
    };
}
