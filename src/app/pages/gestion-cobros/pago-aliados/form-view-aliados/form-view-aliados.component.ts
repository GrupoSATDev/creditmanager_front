import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PagoAliadosService } from '../../../../core/services/pago-aliados.service';
import { DateAdapter, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { IConfig, provideNgxMask } from 'ngx-mask';
import { Subscription, tap } from 'rxjs';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatDatepickerInput } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-view-aliados',
  standalone: true,
    imports: [
        CustomTableComponent,
        FormsModule,
        AsyncPipe,
        MatFormField,
        MatLabel,
        MatOption,
        MatSelect,
        NgForOf,
        NgIf,
        MatDatepickerInput,
        MatInput,
        MatButton,
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
    form: any = {
        fechaCreacion: '',
        fechaFinal: '',
        fechaIncial: '',
        nombreSubempresa: '',
        total: ''
    }

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
        this.subscription$ = this.pagoAliadoService.getAliado(id).pipe(
            tap((response) => {
                response.data.detallePagoAliados.forEach((items) => {
                    items.total = this.currencyPipe.transform(items.total, 'USD', 'symbol', '1.2-2');
                    items.valorFacturado = this.currencyPipe.transform(items.valorFacturado, 'USD', 'symbol', '1.2-2');
                    items.porcentaje = this.decimalPipe.transform(items.porcentaje, '1.2-2') + '%';
                })
                return response;
            })
        ).subscribe((response) => {
            if (response && Array.isArray(response.data.detallePagoAliados)) {
                this.data = response.data.detallePagoAliados;
                this.form.fechaCreacion = this.datePipe.transform( response.data.fechaCreacion, 'dd/MM/YYYY');
                this.form.fechaFinal = response.data.fechaFinal;
                this.form.nombreSubempresa = response.data.nombreSubempresa;
                this.form.total = this.currencyPipe.transform(response.data.total, 'USD', 'symbol', '1.2-2');;
            }
        })
    }

    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
    }

    closeDialog() {
        this.router.navigate(['/pages/gestion-cobros/aliados']);;
    }


}
