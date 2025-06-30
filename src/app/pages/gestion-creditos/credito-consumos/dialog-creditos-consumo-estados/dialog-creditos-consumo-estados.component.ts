import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { SwalService } from '../../../../core/services/swal.service';
import { CreditoConsumosService } from '../../../../core/services/credito-consumos.service';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
    selector: 'app-dialog-creditos-consumo-estados',
    standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        NgxMaskDirective,
        MatDialogClose,
    ],
    templateUrl: './dialog-creditos-consumo-estados.component.html',
    styleUrl: './dialog-creditos-consumo-estados.component.scss',
})
export class DialogCreditosConsumoEstadosComponent implements OnInit {
    public dialogRef = inject(
        MatDialogRef<DialogCreditosConsumoEstadosComponent>
    );
    public _matData = inject(MAT_DIALOG_DATA);
    public estadosDatosService = inject(EstadosDatosService);
    private swalService = inject(SwalService);
    private creditoConsumoService = inject(CreditoConsumosService);
    public idEstado: number;

    ngOnInit(): void {
        const  data  = this._matData.data;
        const { id } = data;
        this.idEstado = id;
    }

    onCambioEstado(): void {
        this.creditoConsumoService
            .patchCreditoConsumoEstado(this.idEstado)
            .subscribe(
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
    closeDialog() {
        this.dialogRef.close();
    }
}
