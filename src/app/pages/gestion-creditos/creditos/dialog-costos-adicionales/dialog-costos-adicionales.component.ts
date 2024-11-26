import { Component, DestroyRef, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { AsyncPipe, CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { SwalService } from '../../../../core/services/swal.service';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { CobrosFijosService } from '../../../../core/services/cobros-fijos.service';
import { tap } from 'rxjs';
import { MatList, MatListItem } from '@angular/material/list';
import { idCobro } from '../../../../core/constant/cobro-fijo';
import { DetalleConsumoService } from '../../../../core/services/detalle-consumo.service';

const maskConfig: Partial<IConfig> = {
    validation: false,
};


@Component({
  selector: 'app-dialog-costos-adicionales',
  standalone: true,
    imports: [
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        NgxMaskDirective,
        ReactiveFormsModule,
        MatSelect,
        MatOption,
        AsyncPipe,
        NgIf,
        NgForOf,
        MatList,
        MatListItem,
        CurrencyPipe,
    ],
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        provideNgxMask(maskConfig)
    ],
  templateUrl: './dialog-costos-adicionales.component.html',
  styleUrl: './dialog-costos-adicionales.component.scss'
})
export class DialogCostosAdicionalesComponent {
    private fb = inject(FormBuilder);
    public form: FormGroup;
    public dialogRef = inject(MatDialogRef<DialogCostosAdicionalesComponent>);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public _matData = inject(MAT_DIALOG_DATA);
    private swalService = inject(SwalService);
    private readonly destroyedRef = inject(DestroyRef);
    private cobrosFijosService = inject(CobrosFijosService)
    private detalleConsumoService = inject(DetalleConsumoService)


    public costosFijos$ = this.cobrosFijosService.getCobros()
    labelData: any;


    onSave() {
        const data = this._matData.data;
        console.log(data)
        const createData = {
            idCredito: data.id,
            idTipoConsumo: idCobro,
            idTrabajador: data.idTrabajador,
            idCobroFijo: this.labelData.id,
        }

        console.log(createData)
        this.detalleConsumoService.postConsumoFijo(createData).subscribe((response) => {
            console.log(response)
        })

    }

    closeDialog() {
        this.dialogRef.close();
    }

    onSelected(event: MatSelectChange) {
        const data = event.value;
        this.labelData = data;
        console.log(data)

    }


}
