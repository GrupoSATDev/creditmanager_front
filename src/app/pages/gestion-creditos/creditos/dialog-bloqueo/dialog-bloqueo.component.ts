import { Component, inject } from '@angular/core';
import { CurrencyPipe, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { SwalService } from '../../../../core/services/swal.service';
import { CreditosService } from '../../../../core/services/creditos.service';
import { guardar } from '../../../../core/constant/dialogs';
import { EstadosCreditos } from '../../../../core/enums/estados-creditos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-bloqueo',
  standalone: true,
    imports: [
        CurrencyPipe,
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
  templateUrl: './dialog-bloqueo.component.html',
  styleUrl: './dialog-bloqueo.component.scss'
})
export class DialogBloqueoComponent {
    public dialogRef = inject(MatDialogRef<DialogBloqueoComponent>);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public _matData = inject(MAT_DIALOG_DATA);
    private swalService = inject(SwalService);
    private creditoService: CreditosService = inject(CreditosService);
    private router = inject(Router);

    onBloquear() {
        const data = this._matData.data;
        const createData = {
            id: data.id,
            idEstado: EstadosCreditos.BLOQUEADO
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
