import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { IConfig, provideNgxMask } from 'ngx-mask';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { PagoTrabajadoresService } from '../../../../core/services/pago-trabajadores.service';
const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-view-pago-trabajadores',
  standalone: true,
    imports: [
        CustomTableComponent,
        FormsModule,
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
    ],
  templateUrl: './form-view-pago-trabajadores.component.html',
  styleUrl: './form-view-pago-trabajadores.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
        provideNgxMask(maskConfig)
    ],
})
export class FormViewPagoTrabajadoresComponent implements OnInit, OnDestroy {
    public fuseService = inject(FuseConfirmationService);
    private currencyPipe = inject(CurrencyPipe);
    private decimalPipe =  inject(DecimalPipe)
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private datePipe = inject(DatePipe);
    private pagoTrabajadorService = inject(PagoTrabajadoresService);
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

    columns = ['Número de identificación', 'Fecha de creación', 'Número de cuota', 'Valor' ];
    columnPropertyMap = {
        'Número de identificación': 'documentoTrabajador',
        'Fecha de creación': 'fechaCobro',
        'Número de cuota': 'numCuota',
        'Valor': 'valorPago',
    };
    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
    }

    ngOnInit(): void {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        this.getTrabajador(this.id);
    }

    private getTrabajador(id) {
        this.subscription$ = this.pagoTrabajadorService.getPagosTrabajador(id).pipe(
            tap((response) => {
                response.data.detallePagoTrabajador?.forEach((items) => {
                    items.fechaCobro = this.datePipe.transform(items.fechaCobro, 'dd/MM/yyyy');
                    items.valorPago = this.currencyPipe.transform(items.valorPago, 'USD', 'symbol', '1.2-2');
                })
                return response;
            })
        ).subscribe((response) => {
            //TODO remover los comentarios una vez se compongan los arrays
            //if (response && Array.isArray(response.data.detallePagoTrabajador)) {
                console.log('Si entra')
                this.data = response.data.detallePagoTrabajador;
                this.form.fechaCreacion = this.datePipe.transform( response.data.fechaCreacion, 'dd/MM/YYYY');
                this.form.fechaFinal = response.data.fechaFinal;
                this.form.nombreSubempresa = response.data.nombreSubempresa;
                this.form.total = this.currencyPipe.transform(response.data.total, 'USD', 'symbol', '1.2-2');;
            //}
        })
    }

    closeDialog() {
        this.router.navigate(['/pages/gestion-cobros/trabajadores']);
    }

}
