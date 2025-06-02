import { Component, inject, OnInit } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { ReportesService } from '../../../../core/services/reportes.service';
import { AesEncryptionService } from '../../../../core/services/aes-encryption.service';
import { TipoSolicitudesService } from '../../../../core/services/tipo-solicitudes.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { parseCurrency } from '../../../../core/utils/number-utils';
import { exportar } from '../../../../core/constant/dialogs';
import * as XLSX from 'xlsx';
import { map } from 'rxjs';

@Component({
    selector: 'app-reporte-prestamo-historico',
    standalone: true,
    imports: [
        CdkScrollable,
        CustomTableComponent,
        FormsModule,
        FuseAlertComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        NgClass,
    ],
    templateUrl: './reporte-prestamo-historico.component.html',
    styleUrl: './reporte-prestamo-historico.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
    ],
})
export class ReportePrestamoHistoricoComponent implements OnInit {
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
        'Capital prestado',
        'Cantidad de desembolsos',
        'Trabajadores con prestamos activos',
    ];
    columnPropertyMap = {
        Empresa: 'nombreSubEmpresa',
        'Capital prestado': 'capitalPrestado',
        'Cantidad de desembolsos': 'cantidadDesembolso',
        'Trabajadores con prestamos activos': 'prestamosActivos',
    };

    ngOnInit(): void {
        this.onConsultar();
    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    onConsultar() {
        this.reportesService
            .getPrestamoHistorico()
            .pipe(
                map((response) => {
                    response.data.forEach((items) => {
                        items.capitalPrestado = this.currencyPipe.transform(
                            items.capitalPrestado,
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
                CapitalPrestado: parseCurrency(items.capitalPrestado),
                CantidadDeDesembolsos: items.cantidadDesembolso,
                TrabajadoresConPrestamosActivos: items.prestamosActivos,
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
                    `Reporte historico por empresas${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.xlsx`
                );
            }
        });
    }
}
