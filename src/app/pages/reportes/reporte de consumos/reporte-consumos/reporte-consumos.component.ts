import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { DateAdapter, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DetalleConsumoService } from '../../../../core/services/detalle-consumo.service';
import { EstadoCreditosService } from '../../../../core/services/estado-creditos.service';
import { tap } from 'rxjs';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { provideNgxMask } from 'ngx-mask';
import { ReportesService } from '../../../../core/services/reportes.service';

@Component({
  selector: 'app-reporte-consumos',
  standalone: true,
    imports: [
        AsyncPipe,
        CustomTableComponent,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        NgForOf,
        NgIf,
        FuseAlertComponent,
        ReactiveFormsModule,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatSuffix,
        CdkScrollable,
        MatButton,
    ],
  templateUrl: './reporte-consumos.component.html',
  styleUrl: './reporte-consumos.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
    ],
})
export class ReporteConsumosComponent implements OnInit{
    public searchTerm: string = '';
    private fb = inject(FormBuilder);
    public form: FormGroup;
    private reportesService = inject(ReportesService);
    private datePipe = inject(DatePipe);
    estados = new FormControl([''])
    private detalleConsumoService = inject(EstadoCreditosService)
    public detalleConsumo$ = this.detalleConsumoService.getDetalleConsumo().pipe(
        tap((response) => {
            const selectedValue = response.data;
            if (selectedValue) {
                this.form.get('idEstadoCredito').setValue(selectedValue[0].id);
            }
        })
    )
    data = [];
    columns = ['Empresa', 'N factura / Comprobante', 'Valor pendiente' ];
    columnPropertyMap = {
        'Empresa': 'nombreSubEmpresa',
        'N factura / Comprobante': 'numeroFactura',
        'Valor pendiente': 'valorPendiente',
    };

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    onSelect(estado: MatSelectChange) {
        const id = estado.value;
        //this.cobros(id);
    }

    private createForm() {
        this.form = this.fb.group({
            idEstadoCredito: ['', Validators.required],
            fechaInicio: ['', Validators.required],
            fechaFinal: ['', Validators.required],
        })
    }

    ngOnInit(): void {
        this.createForm();
    }

    onConsultar() {
        if (this.form.valid) {
            const {fechaInicio, fechaFinal, ...form } = this.form.getRawValue();
            const fechaIniciallData = this.datePipe.transform(fechaInicio, 'yyyy-MM-dd')
            const fechaFinallData = this.datePipe.transform(fechaFinal, 'yyyy-MM-dd')

            const consulta = {
                fechaInicio: fechaIniciallData,
                fechaFinal: fechaFinallData,
                ...form
            }

            this.reportesService.getReporteConsumo(consulta).subscribe((response) => {
                if (response.data) {
                    this.data = response.data;
                }
            })

        }

    }

}
