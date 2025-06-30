import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { CreditoConsumosService } from '../../../../core/services/credito-consumos.service';
import { SwalService } from '../../../../core/services/swal.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dialog-bloqueos-creditos-consumo',
    standalone: true,
    imports: [MatButton, MatIcon, MatDialogClose],
    templateUrl: './dialog-bloqueos-creditos-consumo.component.html',
    styleUrl: './dialog-bloqueos-creditos-consumo.component.scss',
})
export class DialogBloqueosCreditosConsumoComponent implements OnInit{
    public dialogRef = inject(MatDialogRef<DialogBloqueosCreditosConsumoComponent>);
    public toasService = inject(ToastAlertsService);
    public estadosDatosService = inject(EstadosDatosService);
    public _matData = inject(MAT_DIALOG_DATA);
    private creditoConsumoService = inject(CreditoConsumosService);
    public idEstado: number;
    public estado: boolean;
    private swalService = inject(SwalService);
    private router  = inject(Router);

    ngOnInit(): void {
        const  data  = this._matData.data;
        const { id, estado } = data;
        this.idEstado = id;
        this.estado = estado;
    }

    onCambioEstado(): void {
        this.creditoConsumoService
            .patchCreditoConsumoEstados(this.idEstado, !this.estado)
            .subscribe(
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
    closeDialog() {
        this.dialogRef.close();
    }

}
