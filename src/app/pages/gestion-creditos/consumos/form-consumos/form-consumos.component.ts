import { Component, inject, OnInit } from '@angular/core';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ActivatedRoute } from '@angular/router';
import { DetalleConsumoService } from '../../../../core/services/detalle-consumo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-consumos',
  standalone: true,
  imports: [],
  templateUrl: './form-consumos.component.html',
  styleUrl: './form-consumos.component.scss'
})
export class FormConsumosComponent implements  OnInit{
    public toasService = inject(ToastAlertsService);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public detalleConsumoService = inject(DetalleConsumoService);
    private activatedRoute = inject(ActivatedRoute);
    idCredito: string = '';
    public subcription$: Subscription;

    ngOnInit(): void {
        this.idCredito = this.activatedRoute.snapshot.paramMap.get('id');
        this.getDetalle(this.idCredito);
    }

    getDetalle(id) {
        this.subcription$ = this.detalleConsumoService.getConsumo(id).subscribe((response) => {
            console.log(response)
        })
    }

}
