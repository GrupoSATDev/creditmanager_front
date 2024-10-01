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
import { Subscription } from 'rxjs';
import { CodigosEstadosSolicitudes } from '../../../../core/enums/estados-solicitudes';

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

    onSave() {
        let data = {}
        if (this._matData.data.idEstado == CodigosEstadosSolicitudes.APROBADA) {
            data = {
                ObservaciónAprueba: this.inputValue.value,
                ...this._matData.data
            }
        }else {
            data = {
                ObservacionRechazo: this.inputValue.value,
                ...this._matData.data
            }
        }

        this.subcription$ = this.solicitudService.patchSolicitud(data).subscribe((response) => {
            this.toasService.toasAlertWarn({
                message: 'Registro creado con exito!',
                actionMessage: 'Cerrar',
                duration: 3000
            })
            this.router.navigate(['/pages/gestion-creditos/solicitudes']);
            this.estadosDatosService.stateGridSolicitudes.next({state: true, tab: 0});
            this.close();
        } , error => {
            this.toasService.toasAlertWarn({
                message: 'Ha ocurrido un error!!!!',
                actionMessage: 'Cerrar',
                duration: 3000
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
