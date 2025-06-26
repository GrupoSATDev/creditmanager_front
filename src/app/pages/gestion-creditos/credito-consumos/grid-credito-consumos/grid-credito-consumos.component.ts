import { Component, inject, OnInit } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgIf } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { ReportesService } from '../../../../core/services/reportes.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { exportar } from '../../../../core/constant/dialogs';
import * as XLSX from 'xlsx';
import { CreditoConsumosService } from '../../../../core/services/credito-consumos.service';
import { data } from 'autoprefixer';
import { map } from 'rxjs';
import { parseCurrency } from '../../../../core/utils/number-utils';
import { AesEncryptionService } from '../../../../core/services/aes-encryption.service';

@Component({
    selector: 'app-grid-credito-consumos',
    standalone: true,
    imports: [
        CustomTableComponent,
        FuseAlertComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        MatTab,
        MatTabContent,
        MatTabGroup,
        NgIf,
        NgClass,
    ],
    templateUrl: './grid-credito-consumos.component.html',
    styleUrl: './grid-credito-consumos.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
    ],
})
export class GridCreditoConsumosComponent implements OnInit{
    public searchTerm: string = '';
    private creditoConsumoService = inject(CreditoConsumosService);
    private datePipe = inject(DatePipe);
    public fuseService = inject(FuseConfirmationService);
    private currencyPipe = inject(CurrencyPipe);
    private aesEncriptService = inject(AesEncryptionService);
    data = [];
    exportData = [];


    columns = [
        'Empresa',
        'Trabajador',
        'Identificacion',
        'Crédito',
        'Fecha de creación',
        'Cupo aprobado',
        'Cupo consumido',
        'Cupo disponible',
    ];

    columnPropertyMap = {
        'Empresa': 'nombreSubEmpresa',
        'Trabajador': 'nombreTrabajador',
        'Identificacion': 'docTrabajador',
        'Crédito': 'numCredito',
        'Fecha de creación': 'fechaCreacion',
        'Cupo aprobado': 'cupoAprobado',
        'Cupo consumido': 'cupoConsumido',
        'Cupo disponible': 'cupoDisponible',
    };

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }


    getData() {
        this.creditoConsumoService.getCreditoConsumos().pipe(
            map((response) => {
                response.data.forEach((items) => {
                    items.fechaCreacion = this.datePipe.transform(items.fechaCreacion, 'dd/MM/yyyy');

                    if (items.cupoAprobado) {
                        items.cupoAprobado = this.aesEncriptService.decrypt(items.cupoAprobado);
                    }
                    if (items.cupoConsumido) {
                        items.cupoConsumido = this.aesEncriptService.decrypt(items.cupoConsumido);
                    }
                    if (items.cupoDisponible) {
                        items.cupoDisponible = this.aesEncriptService.decrypt(items.cupoDisponible);
                    }

                    items.cupoAprobado = this.currencyPipe.transform(items.cupoAprobado, 'USD', 'symbol', '1.2-2');
                    items.cupoConsumido = this.currencyPipe.transform(items.cupoConsumido, 'USD', 'symbol', '1.2-2');
                    items.cupoDisponible = this.currencyPipe.transform(items.cupoDisponible, 'USD', 'symbol', '1.2-2');
                });
                return response;
            })
        )
            .subscribe((response) => {
                if (response.data) {
                    this.data = response.data;
                    this.convertDataExport(response.data);
                } else {
                    this.data = [];
                }

        })

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
                    `Reporte recuperación de inversión${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.xlsx`
                );
            }
        });
    }

    private convertDataExport(data) {
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

    ngOnInit(): void {
        this.getData();
    }
}

