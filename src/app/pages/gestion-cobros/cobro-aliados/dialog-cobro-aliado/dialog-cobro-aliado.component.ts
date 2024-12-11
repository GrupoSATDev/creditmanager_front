import { Component, inject, OnDestroy } from '@angular/core';
import { CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SwalService } from '../../../../core/services/swal.service';
import { EstadoCobroAliados } from '../../../../core/enums/estado-cobro-aliados';
import { guardar } from '../../../../core/constant/dialogs';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { CobroAliadosService } from '../../../../core/services/cobro-aliados.service';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';

@Component({
  selector: 'app-dialog-cobro-aliado',
  standalone: true,
    imports: [
        CurrencyPipe,
        FormsModule,
        MatButton,
        MatError,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        NgIf,
        NgxMaskDirective,
        MatDialogClose,
        NgClass,
        ReactiveFormsModule,
    ],
  templateUrl: './dialog-cobro-aliado.component.html',
  styleUrl: './dialog-cobro-aliado.component.scss'
})
export class DialogCobroAliadoComponent implements OnDestroy {
    inputValue = new FormControl('', [Validators.required]);
    public _matData = inject(MAT_DIALOG_DATA);
    private dialogRef = inject(MatDialogRef<DialogCobroAliadoComponent>);
    private router = inject(Router);
    public subcription$: Subscription;
    private swalService = inject(SwalService);
    public fuseService = inject(FuseConfirmationService);
    private cobroAliadoService = inject(CobroAliadosService);
    public estadosDatosService = inject(EstadosDatosService);

    onSave() {
        const inputData = this._matData.data;
        let data = {
            idEstadoCobroPago: EstadoCobroAliados.PAGADOS,
            observacion: this.inputValue.value,
            id: inputData.id
        }

        console.log(data)

        const dialog = this.fuseService.open({
            ...guardar
        });

        dialog.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                this.cobroAliadoService.putCobroAliado(data).subscribe((response) => {
                    this.estadosDatosService.stateGrid.next(true);
                    this.swalService.ToastAler({
                        icon: 'success',
                        title: 'Registro Creado o Actualizado con Exito.',
                        timer: 4000,
                    })
                    this.closeDialog();
                }, error => {
                    this.swalService.ToastAler({
                        icon: 'info',
                        title: error.error.errorMenssages[0],
                        timer: 6000,
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


    ngOnDestroy(): void {

    }

}
