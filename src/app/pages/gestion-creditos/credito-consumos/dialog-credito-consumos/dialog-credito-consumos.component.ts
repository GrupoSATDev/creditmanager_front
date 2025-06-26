import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { DetalleCreditoConsumoService } from '../../../../core/services/detalle-credito-consumo.service';
import { guardar } from '../../../../core/constant/dialogs';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { SwalService } from '../../../../core/services/swal.service';
import { Router } from '@angular/router';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
    selector: 'app-dialog-credito-consumos',
    standalone: true,
    imports: [
        AsyncPipe,
        MatButton,
        MatFormField,
        MatError,
        MatInput,
        MatLabel,
        NgIf,
        NgxMaskDirective,
        ReactiveFormsModule,
    ],
    templateUrl: './dialog-credito-consumos.component.html',
    styleUrl: './dialog-credito-consumos.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        provideNgxMask(maskConfig)
    ],
})
export class DialogCreditoConsumosComponent implements OnInit {
    private fb = inject(FormBuilder);
    public form: FormGroup;
    public _matData = inject(MAT_DIALOG_DATA);
    public dialogRef = inject(MatDialogRef<DialogCreditoConsumosComponent>);
    public detalleCreditoConsumoService = inject(DetalleCreditoConsumoService);
    public fuseService = inject(FuseConfirmationService);
    private swalService = inject(SwalService);
    private router = inject(Router);

    onSave(): void {
        if (this.form.valid) {
            const data = this._matData.data;
            const { montoConsumo, ...form } = this.form.value;


          const createData = {
              idCreditoConsumo: data.id,
              montoConsumo: String(montoConsumo),
              ...form
          }

          console.log(createData);

            const dialog = this.fuseService.open({
                ...guardar
            });

            dialog.afterClosed().subscribe((response) => {
                if (response === 'confirmed') {
                    this.detalleCreditoConsumoService.postDetalleCreditoConsumo(createData).subscribe((response) => {
                        console.log(response)
                        this.swalService.ToastAler({
                            icon: 'success',
                            title: 'Registro Creado o Actualizado con Exito.',
                            timer: 4000,
                        })
                        this.closeDialog();
                        this.router.navigate(['/pages/gestion-creditos/credito-consumos']);
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
        }

    }

    private createForm() {
        this.form = this.fb.group({
            montoConsumo: ['', Validators.required],
            numeroFactura: ['', Validators.required],
            observacion: [''],
        });
    }

    ngOnInit(): void {
        this.createForm();
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
