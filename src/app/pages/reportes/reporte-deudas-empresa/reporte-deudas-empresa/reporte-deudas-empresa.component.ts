import { Component, inject, OnInit } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { ReportesService } from '../../../../core/services/reportes.service';
import { AesEncryptionService } from '../../../../core/services/aes-encryption.service';
import { TipoSolicitudesService } from '../../../../core/services/tipo-solicitudes.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { map } from 'rxjs';
import { parseCurrency } from '../../../../core/utils/number-utils';
import { exportar } from '../../../../core/constant/dialogs';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-reporte-deudas-empresa',
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
    templateUrl: './reporte-deudas-empresa.component.html',
    styleUrl: './reporte-deudas-empresa.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
    ],
})
export class ReporteDeudasEmpresaComponent implements OnInit {
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
        'Capital en deuda',
        'Intereses',
        'Costos adicionales',
    ];
    columnPropertyMap = {
        Empresa: 'nombreSubEmpresa',
        'Capital en deuda': 'capitalDeuda',
        Intereses: 'deudaIntereses',
        'Costos adicionales': 'costoAdicionales',
    };

    ngOnInit(): void {
        this.createForm();
        this.onConsultar();
    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    onConsultar() {


            this.reportesService
                .getDeudasEmpresas()
                .pipe(
                    map((response) => {
                        response.data.forEach((items) => {
                            items.capitalDeuda =
                                this.currencyPipe.transform(
                                    items.capitalDeuda,
                                    'USD',
                                    'symbol',
                                    '1.2-2'
                                );
                            items.deudaIntereses =
                                this.currencyPipe.transform(
                                    items.deudaIntereses,
                                    'USD',
                                    'symbol',
                                    '1.2-2'
                                );

                            items.costoAdicionales =
                                this.currencyPipe.transform(
                                    items.costoAdicionales,
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

    private convertDataExportFijos(data) {
        const convertData = data.map((items) => {
            return {
                Empresa: items.nombreSubEmpresa,
                CapitalEnDeuda: parseCurrency(items.capitalDeuda),
                Intereses: parseCurrency(items.deudaIntereses),
                CostosAdicionales: parseCurrency(items.costoAdicionales),
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
                    `Reporte de deudas empresas${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.xlsx`
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
