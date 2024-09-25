import { Component, inject, OnInit } from '@angular/core';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DetalleConsumoService } from '../../../../core/services/detalle-consumo.service';
import { Subscription } from 'rxjs';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CodigosEstadosSolicitudes } from '../../../../core/enums/estados-solicitudes';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CodigosDetalleConsumo } from '../../../../core/enums/detalle-consumo';
import { guardar } from '../../../../core/constant/dialogs';

@Component({
  selector: 'app-form-consumos',
  standalone: true,
    imports: [
        CdkScrollable,
        CurrencyPipe,
        DatePipe,
        MatAnchor,
        MatButton,
        MatIcon,
        NgIf,
        RouterLink,
    ],
  templateUrl: './form-consumos.component.html',
  styleUrl: './form-consumos.component.scss'
})
export class FormConsumosComponent implements  OnInit{
    public toasService = inject(ToastAlertsService);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public detalleConsumoService = inject(DetalleConsumoService);
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);
    idCredito: string = '';
    public detalle: any;
    public subcription$: Subscription;

    ngOnInit(): void {
        this.idCredito = this.activatedRoute.snapshot.paramMap.get('id');
        this.getDetalle(this.idCredito);
    }

    getDetalle(id) {
        this.subcription$ = this.detalleConsumoService.getConsumo(id).subscribe((response) => {
            console.log(response)
            this.detalle = response.data;
        })
    }

    onSave() {
        const data = {
            idEstado: CodigosDetalleConsumo.APROBADA,
            id: this.detalle.id
        }

        const dialog = this.fuseService.open({
            ...guardar
        });

        dialog.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                this.subcription$ = this.detalleConsumoService.patchConsumo(data).subscribe((response) => {

                        this.toasService.toasAlertWarn({
                            message: 'Registro creado con exito!',
                            actionMessage: 'Cerrar',
                            duration: 3000
                        })
                        this.router.navigate(['/pages/gestion-creditos/consumos']);
                        this.estadosDatosService.stateGridSolicitudes.next({state: true, tab: 0});

                }, error => {
                    this.toasService.toasAlertWarn({
                        message: 'Ha ocurrido un error!!!!',
                        actionMessage: 'Cerrar',
                        duration: 3000
                    })
                })
            }
        })


    }

    onReject() {
        const data = {
            idEstado: CodigosDetalleConsumo.RECHAZADA,
            id: this.detalle.id
        }

        const dialog = this.fuseService.open({
            ...guardar
        });

        dialog.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                this.subcription$ = this.detalleConsumoService.patchConsumo(data).subscribe((response) => {
                    if (response.isExitoso) {
                        this.toasService.toasAlertWarn({
                            message: 'Registro creado con exito!',
                            actionMessage: 'Cerrar',
                            duration: 3000
                        })
                        this.router.navigate(['/pages/gestion-creditos/consumos']);
                        this.estadosDatosService.stateGridSolicitudes.next({state: true, tab: 0});
                    }
                }, error => {
                    this.toasService.toasAlertWarn({
                        message: 'Ha ocurrido un error!!!!',
                        actionMessage: 'Cerrar',
                        duration: 3000
                    })
                })
            }
        })

    }

    protected readonly CodigosDetalleConsumo = CodigosDetalleConsumo;
}
