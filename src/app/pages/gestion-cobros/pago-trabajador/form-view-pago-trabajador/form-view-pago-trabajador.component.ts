import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { CurrencyPipe, DatePipe, DecimalPipe, NgForOf } from '@angular/common';
import { IConfig, provideNgxMask } from 'ngx-mask';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PagoTrabajadoresService } from '../../../../core/services/pago-trabajadores.service';
import { CdkScrollable } from '@angular/cdk/scrolling';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-view-pago-trabajador',
  standalone: true,
    imports: [
        CdkScrollable,
        CurrencyPipe,
        DatePipe,
        NgForOf,
    ],
  templateUrl: './form-view-pago-trabajador.component.html',
  styleUrl: './form-view-pago-trabajador.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
        provideNgxMask(maskConfig)
    ],
})
export class FormViewPagoTrabajadorComponent  implements OnInit, OnDestroy  {

    public fuseService = inject(FuseConfirmationService);
    private currencyPipe = inject(CurrencyPipe);
    private decimalPipe =  inject(DecimalPipe)
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private datePipe = inject(DatePipe);
    public subcription$: Subscription;
    private pagoTrabajadorService = inject(PagoTrabajadoresService);
    public detalleFactura: any;

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.getPagoIndividual(id);
    }

    getPagoIndividual(id) {
        this.subcription$ = this.pagoTrabajadorService.getPagosTrabajadorIndividual(id).subscribe((response) => {
            if (response.data) {
                this.detalleFactura = response.data;
            }
        })
    }

}
