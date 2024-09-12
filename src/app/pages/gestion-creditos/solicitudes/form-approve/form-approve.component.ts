import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmpleadosService } from '../../../../core/services/empleados.service';
import { Observable, Subscription } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { AsyncPipe, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-approve',
  standalone: true,
    imports: [
        MatButton,
        CurrencyPipe,
        NgIf,
        CdkScrollable,
        AsyncPipe,
        NgForOf,
    ],
  templateUrl: './form-approve.component.html',
  styleUrl: './form-approve.component.scss'
})
export class FormApproveComponent implements OnInit, OnDestroy{
    private empleadosServices = inject(EmpleadosService);
    private solicitudService: SolicitudesService = inject(SolicitudesService);
    public toasService = inject(ToastAlertsService);
    public estadosDatosService = inject(EstadosDatosService);
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);
    public subcription$: Subscription;
    public items: any;
    public detalleEmpleado: any;

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.getSolicitud(id);

    }

    getSolicitud(id) {
        this.subcription$ = this.solicitudService.getSolicitud(id).subscribe((response) => {
            this.items = response.data;
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




}
