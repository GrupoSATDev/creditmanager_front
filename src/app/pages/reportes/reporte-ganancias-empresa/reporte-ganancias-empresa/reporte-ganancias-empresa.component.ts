import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { DateAdapter, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { ReportesService } from '../../../../core/services/reportes.service';
import { AesEncryptionService } from '../../../../core/services/aes-encryption.service';
import { TipoSolicitudesService } from '../../../../core/services/tipo-solicitudes.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { parseCurrency } from '../../../../core/utils/number-utils';
import { exportar } from '../../../../core/constant/dialogs';
import * as XLSX from 'xlsx';
import { map } from 'rxjs';

@Component({
    selector: 'app-reporte-ganancias-empresa',
    standalone: true,
    imports: [
        CdkScrollable,
        CustomTableComponent,
        FuseAlertComponent,
        MatButton,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatSuffix,
        ReactiveFormsModule,
        NgClass,
    ],
    templateUrl: './reporte-ganancias-empresa.component.html',
    styleUrl: './reporte-ganancias-empresa.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
    ],
})
export class ReporteGananciasEmpresaComponent implements OnInit {
    public searchTerm: string = '';
    private fb = inject(FormBuilder);
    public form: FormGroup;
    private reportesService = inject(ReportesService);
    private datePipe = inject(DatePipe);
    estados = new FormControl(['']);
    data = [];
    private aesEncriptService = inject(AesEncryptionService);
    private tipoSolicitudesService = inject(TipoSolicitudesService);
    private currencyPipe = inject(CurrencyPipe);
    exportData = [];
    public fuseService = inject(FuseConfirmationService);

    columns = [
        'Empresa',
        'Capital recuperado',
        'Intereses',
        'Costos adicionales',
    ];
    columnPropertyMap = {
        Empresa: 'nombreSubEmpresa',
        'Capital recuperado': 'capitalRecuperado',
        Intereses: 'totalInteresesGanado',
        'Costos adicionales': 'totalCobrosFijosGanado',
    };

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    ngOnInit(): void {
        this.createForm();
    }

    onConsultar() {
        if (this.form.valid) {
            const { fechaInicio, fechaFinal,  } =
                this.form.getRawValue();
            const fechaIniciallData = this.datePipe.transform(
                fechaInicio,
                'yyyy-MM-dd'
            );
            const fechaFinallData = this.datePipe.transform(
                fechaFinal,
                'yyyy-MM-dd'
            );

            let consulta = {
                fechaInicio: fechaIniciallData,
                fechaFinal: fechaFinallData,
            };

            console.log(consulta);

            this.reportesService
                .getReporteGancias(consulta)
                .pipe(
                    map((response) => {
                        response.data.forEach((items) => {
                            items.capitalRecuperado = this.currencyPipe.transform(
                                items.capitalRecuperado,
                                'USD',
                                'symbol',
                                '1.2-2'
                            );
                            items.totalCobrosFijosGanado =
                                this.currencyPipe.transform(
                                    items.totalCobrosFijosGanado,
                                    'USD',
                                    'symbol',
                                    '1.2-2'
                                );

                            items.totalInteresesGanado =
                                this.currencyPipe.transform(
                                    items.totalInteresesGanado,
                                    'USD',
                                    'symbol',
                                    '1.2-2'
                                );
                        });
                        return response;
                    })
                )
                .subscribe((response) => {
                    if (response.data) {
                        this.data = response.data;
                        this.convertDataExportFijos(response.data);
                    } else {
                        this.data = [];
                    }
                });
        }
    }

    private convertDataExportFijos(data) {
        const convertData = data.map((items) => {
            return {
                Empresa: items.nombreSubEmpresa,
                CapitalRecuperado: parseCurrency(items.capitalRecuperado),
                Intereses: parseCurrency(items.totalInteresesGanado),
                CostosAdicionales: parseCurrency(items.totalCobrosFijosGanado),

            };
        });
        this.exportData = convertData;
    }

    exportToExcel(data: any[]) {
        const dialog = this.fuseService.open({
            ...exportar,
        });

        dialog.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                // Create worksheet
                const worksheet = XLSX.utils.json_to_sheet(data);

                // Create workbook
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

                // Export file
                XLSX.writeFile(
                    workbook,
                    `Reporte de ganancias${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.xlsx`
                );
            }
        });
    }

    private createForm() {
        this.form = this.fb.group({
            fechaInicio: ['', Validators.required],
            fechaFinal: ['', Validators.required],
        });
    }
}
