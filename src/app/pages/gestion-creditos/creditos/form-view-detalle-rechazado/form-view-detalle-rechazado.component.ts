import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreditosService } from '../../../../core/services/creditos.service';

@Component({
  selector: 'app-form-view-detalle-rechazado',
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
  templateUrl: './form-view-detalle-rechazado.component.html',
  styleUrl: './form-view-detalle-rechazado.component.scss'
})
export class FormViewDetalleRechazadoComponent implements OnInit, OnDestroy {

    public toasService = inject(ToastAlertsService);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);
    public subcription$: Subscription;
    public items: any;
    public detalleEmpleado: any;
    public _matDialog = inject(MatDialog);
    private creditoService: CreditosService = inject(CreditosService);

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.getCredito(id);
    }

    getCredito(id) {
        this.subcription$ = this.creditoService.getCredito(id).subscribe((response) => {
            this.items = response.data;
        })
    }

}
