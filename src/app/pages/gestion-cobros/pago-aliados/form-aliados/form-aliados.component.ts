import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatOption, MatSelect } from '@angular/material/select';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { IConfig, provideNgxMask } from 'ngx-mask';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { EmpresasClientesService } from '../../../../core/services/empresas-clientes.service';
import { DetalleConsumoService } from '../../../../core/services/detalle-consumo.service';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-aliados',
  standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatFormField,
        MatInput,
        MatLabel,
        MatSuffix,
        AsyncPipe,
        MatOption,
        MatSelect,
        NgForOf,
        NgIf,
        MatButton,
    ],
  templateUrl: './form-aliados.component.html',
  styleUrl: './form-aliados.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        provideNgxMask(maskConfig)
    ],
})
export class FormAliadosComponent implements OnInit{
    private fb = inject(FormBuilder);
    public form: FormGroup;
    public dialogRef = inject(MatDialogRef<FormAliadosComponent>);
    public _matData = inject(MAT_DIALOG_DATA);
    private empresaClienteService = inject(EmpresasClientesService)
    private detalleConsumoService = inject(DetalleConsumoService);

    empresa$ = this.empresaClienteService.getEmpresas();

    private createForm() {
        this.form = this.fb.group({
            fechaIncial: ['', [Validators.required] ],
            fechaFinal: ['', Validators.required],
            idSubEmpresa: ['', Validators.required],
        })

    }

    ngOnInit(): void {
        this.createForm();
    }

    closeDialog() {
        this.dialogRef.close();
    }

    onGet() {
        if (this.form.valid) {
            const data = this.form.getRawValue();

            this.getAllPago(data);

        }
    }

    private getAllPago(data) {
        this.detalleConsumoService.getPagosAliados(data).subscribe((response) => {
            if (response) {

            }
        })
    }



}
