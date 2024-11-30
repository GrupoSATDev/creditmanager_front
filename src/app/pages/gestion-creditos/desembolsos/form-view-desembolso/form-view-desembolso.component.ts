import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DetalleConsumoService } from '../../../../core/services/detalle-consumo.service';
import { Subscription, switchMap } from 'rxjs';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { IConfig, provideNgxMask } from 'ngx-mask';
import { FuseAlertType } from '../../../../../@fuse/components/alert';
import { EmpleadosService } from '../../../../core/services/empleados.service';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-view-desembolso',
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
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        provideNgxMask(maskConfig)
    ],
  templateUrl: './form-view-desembolso.component.html',
  styleUrl: './form-view-desembolso.component.scss'
})
export class FormViewDesembolsoComponent implements OnInit, OnDestroy{
    private activatedRoute = inject(ActivatedRoute);
    public items: any;
    public _matDialog = inject(MatDialog);
    private detalleConsumoService = inject(DetalleConsumoService);
    private currencyPipe = inject(CurrencyPipe);
    private subscription$: Subscription;
    private empleadosServices = inject(EmpleadosService)
    showAlert: boolean = false;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };

    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
    }

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.getSolicitud(id);
    }

    private getSolicitud(id) {
        this.subscription$ = this.detalleConsumoService.getDetalleConsumoDesembolso(id).subscribe((response) => {
            if(response) {
                this.showAlert = false;
                this.items = response.data;

            }

        }, error => {
            this.alert = {
                type: 'error',
                message: 'El trabajador no existe!'
            };
            // Show the alert
            this.showAlert = true;
        })

    }

}
