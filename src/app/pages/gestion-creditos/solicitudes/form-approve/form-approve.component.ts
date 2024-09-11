import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmpleadosService } from '../../../../core/services/empleados.service';
import { Subscription } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { CurrencyPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-form-approve',
  standalone: true,
    imports: [
        MatButton,
        CurrencyPipe,
        NgIf,
    ],
  templateUrl: './form-approve.component.html',
  styleUrl: './form-approve.component.scss'
})
export class FormApproveComponent implements OnInit, OnDestroy, AfterViewInit{
    private empleadosServices = inject(EmpleadosService);
    public dialogRef = inject(MatDialogRef<FormApproveComponent>);
    private solicitudService: SolicitudesService = inject(SolicitudesService);
    public toasService = inject(ToastAlertsService);
    public estadosDatosService = inject(EstadosDatosService);
    public _matData = inject(MAT_DIALOG_DATA);
    public subcription$: Subscription;
    public empleadoData: any;
    public detalleEmpleado: any;

    ngOnInit(): void {
        const dialogData = this._matData;
        const {idTrabajador} = dialogData.data;
        this.detalleEmpleado = dialogData.data;
        this.getEmpleado(idTrabajador)
    }

    getEmpleado(id) {
        this.subcription$ = this.empleadosServices.getEmpleado(id).subscribe((response) => {
            this.empleadoData = response.data;
        })

    }

    onSave() {
        const data  = {
            idEstado: this.detalleEmpleado.idEstadoSolicitud,
            id: this.detalleEmpleado.id
        }
        this.subcription$ = this.solicitudService.patchSolicitud(data).subscribe((response) => {
            if (response) {
                this.estadosDatosService.stateGrid.next(true);
                this.toasService.toasAlertWarn({
                    message: 'Registro creado con exito!',
                    actionMessage: 'Cerrar',
                    duration: 3000
                })
                this.closeDialog();
            }
        }, error => {
            this.toasService.toasAlertWarn({
                message: 'Ha ocurrido un error!!!!',
                actionMessage: 'Cerrar',
                duration: 3000
            })
        })

    }


    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    closeDialog() {
        this.dialogRef.close();
    }

    ngAfterViewInit(): void {
    }



}
