import { Component, inject, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule, ValidationErrors,
    ValidatorFn, Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe, DatePipe, NgClass, NgIf } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { SwalService } from '../../../../core/services/swal.service';
import { CreditoConsumosService } from '../../../../core/services/credito-consumos.service';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
    selector: 'app-dialog-cupos-creditos-consumo',
    standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatError,
        MatFormField,
        MatIcon,
        MatInput,
        MatDialogClose,
        NgClass,
        ReactiveFormsModule,
        NgxMaskDirective,
        NgIf,
        MatLabel,
    ],
    templateUrl: './dialog-cupos-creditos-consumo.component.html',
    styleUrl: './dialog-cupos-creditos-consumo.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        provideNgxMask(maskConfig),
    ],
})
export class DialogCuposCreditosConsumoComponent implements OnInit {
    public dialogRef = inject(
        MatDialogRef<DialogCuposCreditosConsumoComponent>
    );
    public _matData = inject(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);
    public form: FormGroup;
    public estadosDatosService = inject(EstadosDatosService);
    private swalService = inject(SwalService);
    private creditoConsumoService = inject(CreditoConsumosService);
    public data: any = { };
    public cupoAprobado: FormControl = new FormControl('');

    ngOnInit(): void {
        const data = this._matData.data;
        this.data = data;
        const cupoAprobado =
            typeof data.cupoAprobado === 'string' ? parseFloat(data.cupoAprobado.replace(/[\$,]/g, '')) : typeof data.cupoAprobado === 'number' ? data.cupoAprobado : 0;

        const cupoConsumido =
            typeof data.cupoConsumido === 'string' ? parseFloat(data.cupoConsumido.replace(/[\$,]/g, '')) : typeof data.cupoConsumido === 'number' ? data.cupoConsumido : 0;
        this.cupoAprobado.setValidators([maxAmountValidator(cupoAprobado, cupoConsumido), Validators.required, ]);
        this.cupoAprobado.updateValueAndValidity();
    }

    closeDialog() {
        this.dialogRef.close();
    }

    onGuardar(): void {
        const data = {
            id: this.data.id,
            cupoAprobado: String(this.cupoAprobado.value),
            idSubEmpresa: this.data.idSubEmpresa,
            estado: true,
        };

        this.creditoConsumoService.putCreditoConsumo(data).subscribe(
            (response) => {
                this.estadosDatosService.stateGrid.next(true);
                this.swalService.ToastAler({
                    icon: 'success',
                    title: 'Registro Creado o Actualizado con Exito.',
                    timer: 4000,
                });
                this.closeDialog();
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

export function maxAmountValidator(cupoAprobado: number, cupoConsumido: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const nuevoCupo = control.value;
        if (cupoConsumido === 0) {
            return null;
        }

        return nuevoCupo < cupoAprobado ? { maxAmount: { cupoAprobado } } : null;
    };
}

