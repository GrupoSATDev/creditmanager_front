import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { SwalService } from '../../../../core/services/swal.service';
import { CreditosService } from '../../../../core/services/creditos.service';
import { Router } from '@angular/router';
import { EstadosCreditos } from '../../../../core/enums/estados-creditos';

@Component({
  selector: 'app-dialog.desbloqueo',
  standalone: true,
    imports: [
        MatButton,
        MatIcon,
        MatDialogClose,
    ],
  templateUrl: './dialog.desbloqueo.component.html',
  styleUrl: './dialog.desbloqueo.component.scss'
})
export class DialogDesbloqueoComponent {
    public dialogRef = inject(MatDialogRef<DialogDesbloqueoComponent>);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public _matData = inject(MAT_DIALOG_DATA);
    private swalService = inject(SwalService);
    private creditoService: CreditosService = inject(CreditosService);
    private router = inject(Router);

    onDesbloquear() {
        const data = this._matData.data;
        const createData = {
            id: data.id,
            idEstado: EstadosCreditos.APROBADO
        }

        this.creditoService.patchRechazado(createData).subscribe((response) => {
            console.log(response)
            this.estadosDatosService.stateGrid.next(true);
            this.swalService.ToastAler({
                icon: 'success',
                title: 'Registro Creado o Actualizado con Exito.',
                timer: 4000,
            })
            this.router.navigate(['/pages/gestion-creditos/creditos']);
            this.closeDialog();
        }, error => {
            this.swalService.ToastAler({
                icon: 'error',
                title: 'Ha ocurrido un error al crear el registro!',
                timer: 4000,
            })
        })
    }

    closeDialog() {
        this.dialogRef.close();
    }

}
