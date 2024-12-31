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
import * as XLSX from 'xlsx';
import { parseCurrency } from '../../../../core/utils/number-utils';
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
    exportData: any;

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

    columns = ['Identificación', 'Nombres Apellidos', 'Valor cobro',];
    columnPropertyMap = {
        'Identificación': 'documentoTrabajador',
        'Nombres Apellidos': 'nombreCompleto',
        'Valor cobro': 'valorPago',
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
                this.form.total = this.currencyPipe.transform(response.data.total, 'USD', 'symbol', '1.2-2');
                this.exportData = response.data;
            //}
        })
    }

    exportToExcel() {
        const header = [
            ['Detalle cobro trabajadores'], // Título
            ['Empresa:', this.exportData.nombreSubempresa],
            ['Fecha de liquidación:',this.exportData.fechaFinal],
            ['Total:', this.exportData.total],
        ];


        const detalle = this.exportData.detallePagoTrabajador.map((items) => {
            return {
                Identificación: items.documentoTrabajador,
                'Nombre completo': items.nombreCompleto,
                'Valor': parseCurrency(items.valorPago),
            };
        })

        // Crear una hoja de trabajo para el encabezado
        const worksheet = XLSX.utils.aoa_to_sheet(header);

        // Agregar espacio entre el encabezado y el detalle
        const detailStartRow = header.length + 2; // Encabezado + 1 fila vacía

        // Combinar encabezado y detalle en la misma hoja
        XLSX.utils.sheet_add_json(worksheet, detalle, {
            origin: `A${detailStartRow}`, // Comienza después del encabezado
            skipHeader: false, // Incluye encabezados de columnas
        });

        // Ajustar celdas (opcional: unir celdas para título)
        worksheet['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // Unir celdas para el título
        ];

        // Crear el libro de trabajo y guardar
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `DetallePago${this.exportData.fechaFinal}`);
        XLSX.writeFile(workbook, `DetallePago${this.exportData.fechaFinal}.xlsx`);

    }

    closeDialog() {
        this.router.navigate(['/pages/gestion-cobros/trabajadores']);
    }

}
