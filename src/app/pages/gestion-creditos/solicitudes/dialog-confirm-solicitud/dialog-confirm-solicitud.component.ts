import { Component, inject, OnDestroy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { JsonPipe, NgClass } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { CodigosEstadosSolicitudes } from '../../../../core/enums/estados-solicitudes';
import { SwalService } from '../../../../core/services/swal.service';

@Component({
  selector: 'app-dialog-confirm-solicitud',
  standalone: true,
    imports: [
        MatIcon,
        MatIconButton,
        MatDialogClose,
        NgClass,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        MatButton,
        JsonPipe,
    ],
  templateUrl: './dialog-confirm-solicitud.component.html',
  styleUrl: './dialog-confirm-solicitud.component.scss'
})
export class DialogConfirmSolicitudComponent implements OnDestroy{
    inputValue = new FormControl('');
    public _matData = inject(MAT_DIALOG_DATA);
    private solicitudService: SolicitudesService = inject(SolicitudesService);
    public toasService = inject(ToastAlertsService);
    public estadosDatosService = inject(EstadosDatosService);
    private activatedRoute = inject(ActivatedRoute);
    private dialogRef = inject(MatDialogRef<DialogConfirmSolicitudComponent>);
    private router = inject(Router);
    public subcription$: Subscription;
    private swalService = inject(SwalService);

    onSave() {
        let data = {}
        let putData = {

        }
        if (this._matData.data.idEstado == CodigosEstadosSolicitudes.APROBADA) {
            putData = {
                id: this._matData.data.id,
                cupo: this._matData.data.cupo,
                idTipoSolicitud: this._matData.data.idTipoSolicitud,
                observacion: this._matData.data.observacion,
                observaciónAprueba: this.inputValue.value,
                observacionRechazo: ''
            }
            data = {
                id: this._matData.data.id,
                idEstado: this._matData.data.idEstado,
            }
        }else {
            putData = {
                id: this._matData.data.id,
                cupo: this._matData.data.cupo,
                idTipoSolicitud: this._matData.data.idTipoSolicitud,
                observacion: this._matData.data.observacion,
                observacionRechazo: this.inputValue.value,
                observaciónAprueba: ''
            }
            data = {
                id: this._matData.data.id,
                idEstado: this._matData.data.idEstado,
            }
        }

        this.subcription$ = this.solicitudService.patchSolicitud(data).pipe(
            switchMap((response) => {
                return this.solicitudService.putSolicitudes(putData)
            })
        ).subscribe((response) => {
            this.swalService.ToastAler({
                icon: 'success',
                title: 'Registro Creado o Actualizado con Exito.',
                timer: 4000,
            })
            this.router.navigate(['/pages/gestion-creditos/solicitudes']);
            this.estadosDatosService.stateGridSolicitudes.next({state: true, tab: 0});
            this.close();
        } , error => {
            this.swalService.ToastAler({
                icon: 'error',
                title: 'Ha ocurrido un error al crear el registro!',
                timer: 4000,
            })
        });

    }

    close() {
        this.dialogRef.close();
    }

    ngOnDestroy(): void {
        //this.subcription$.unsubscribe();
    }

    protected readonly CodigosEstadosSolicitudes = CodigosEstadosSolicitudes;
}
