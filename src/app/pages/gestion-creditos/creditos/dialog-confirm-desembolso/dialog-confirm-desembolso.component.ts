import { Component, inject, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { SwalService } from '../../../../core/services/swal.service';
import { TipoSolicitudesService } from '../../../../core/services/tipo-solicitudes.service';
import { map, tap } from 'rxjs';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { guardar } from '../../../../core/constant/dialogs';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';

const maskConfig: Partial<IConfig> = {
    validation: false,
};


@Component({
  selector: 'app-dialog-confirm-desembolso',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatDialogClose,
        ReactiveFormsModule,
        NgIf,
        MatError,
        CurrencyPipe,
        NgxMaskDirective,
        NgClass,
    ],
    providers: [
        provideNgxMask(maskConfig)
    ],
  templateUrl: './dialog-confirm-desembolso.component.html',
  styleUrl: './dialog-confirm-desembolso.component.scss'
})
export class DialogConfirmDesembolsoComponent implements OnInit{
    public _matData = inject(MAT_DIALOG_DATA);
    private swalService = inject(SwalService);
    private tipoSolicitudService = inject(TipoSolicitudesService)
    idSolicitud : string;
    tipoSolicitud$ = this.tipoSolicitudService.getTipos().pipe(
        map((response) => {
            this.idSolicitud = response.data[0].id;
            return response;
        })
    ).subscribe()
    cupo = new  FormControl('', )
    public fuseService = inject(FuseConfirmationService);
    private solicitudService: SolicitudesService = inject(SolicitudesService)
    public dialogRef = inject(MatDialogRef<DialogConfirmDesembolsoComponent>);
    public cupoAvance : number;

    validarCampo() {
        this.cupoAvance = (this._matData.data.cupoAprobado) - ((this._matData.data.cupoAprobado * 20) / 100)
        this.cupo.setValidators(Validators.compose([Validators.required, validateNumbers(this.cupoAvance)]))
        this.cupo.updateValueAndValidity();
    }


    onSave() {
            const createData = {
                cupo: Number(this.cupo.value),
                idTipoSolicitud: this.idSolicitud
            }

        const dialog = this.fuseService.open({
            ...guardar
        });

        dialog.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                this.solicitudService.postSolicitudes(createData).subscribe((res) => {
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

        });
    }

    closeDialog() {
        this.dialogRef.close();
    }

    ngOnInit(): void {
        this.validarCampo();
    }

}

export function validateNumbers(valoraComparar: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {

        const value = control.value;
        console.log(valoraComparar)

        if (value > valoraComparar) {
            return {notEqual: true}
        }
        return null;

    };
}
