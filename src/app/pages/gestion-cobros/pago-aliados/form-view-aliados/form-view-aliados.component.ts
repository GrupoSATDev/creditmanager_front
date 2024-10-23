import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PagoAliadosService } from '../../../../core/services/pago-aliados.service';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { IConfig, provideNgxMask } from 'ngx-mask';
import { Subscription } from 'rxjs';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-view-aliados',
  standalone: true,
    imports: [
        CustomTableComponent,
    ],
  templateUrl: './form-view-aliados.component.html',
  styleUrl: './form-view-aliados.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
        provideNgxMask(maskConfig)
    ],
})
export class FormViewAliadosComponent implements OnInit, OnDestroy{
    public fuseService = inject(FuseConfirmationService);
    private currencyPipe = inject(CurrencyPipe);
    private decimalPipe =  inject(DecimalPipe)
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private pagoAliadoService = inject(PagoAliadosService);
    private datePipe = inject(DatePipe);
    private subscription$: Subscription;

    data = [];
    totalPagar: number;
    totalComision: number;
    subtotal: number;
    id: string;

    columns = ['Número de factura', 'Porcentaje', 'Valor facturado', 'Total' ];
    columnPropertyMap = {
        'Número de factura': 'numeroFactura',
        'Porcentaje': 'porcentaje',
        'Valor facturado': 'valorFacturado',
        'Total': 'total',
    };

    ngOnInit(): void {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        this.getAliado(this.id);
    }

    private getAliado(id) {
        this.subscription$ = this.pagoAliadoService.getAliado(id).subscribe((response) => {
            if (response && Array.isArray(response.data.detallePagoAliados)) {
                this.data = response.data.detallePagoAliados;
            }
        })
    }

    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
    }

}
