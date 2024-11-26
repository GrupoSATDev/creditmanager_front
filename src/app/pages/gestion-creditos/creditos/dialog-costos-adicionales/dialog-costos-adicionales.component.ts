import { Component, DestroyRef, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { AsyncPipe, CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { SwalService } from '../../../../core/services/swal.service';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { CobrosFijosService } from '../../../../core/services/cobros-fijos.service';
import { map, tap } from 'rxjs';
import { MatList, MatListItem } from '@angular/material/list';
import { idCobro } from '../../../../core/constant/cobro-fijo';
import { DetalleConsumoService } from '../../../../core/services/detalle-consumo.service';
import { guardar } from '../../../../core/constant/dialogs';

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
    public cobroFijo: FormControl = new FormControl('');


    public costosFijos$ = this.cobrosFijosService.getCobros().pipe(
        tap((response) => {
            const cantidadCuotas = this._matData.data.cantCuotas;
            const cobroSugerido = this.obtenerCobroSugerido(response.data, cantidadCuotas);

            if (!this.cobroFijo.value) {
                this.cobroFijo.setValue(cobroSugerido);
            }
        })

    )

    private obtenerCobroSugerido(cobros: any[], cantidadCuotas: number): any {
        const rangos = [
            { min: 0, max: 30, indice: 0 },
            { min: 31, max: 60, indice: 1 },
            { min: 61, max: 90, indice: 2 },
            { min: 91, max: 120, indice: 3 }
        ];

        const rangoSeleccionado = rangos.find(
            rango => cantidadCuotas >= rango.min && cantidadCuotas <= rango.max
        );

        return rangoSeleccionado
            ? cobros[rangoSeleccionado.indice]
            : cobros[0];
    }

    onSave() {
        const data = this._matData.data;
        const {id} = this.cobroFijo.value;
        const createData = {
            idCredito: data.id,
            idTipoConsumo: idCobro,
            idTrabajador: data.idTrabajador,
            idCobroFijo: id,
        }

        const dialog = this.fuseService.open({
            ...guardar
        });

        dialog.afterClosed().subscribe((response) => {

            if (response === 'confirmed') {
                this.detalleConsumoService.postConsumoFijo(createData).subscribe((response) => {
                    console.log(response)
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

    }

    closeDialog() {
        this.dialogRef.close();
    }


}
