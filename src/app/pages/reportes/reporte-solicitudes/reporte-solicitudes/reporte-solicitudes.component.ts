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
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { ReportesService } from '../../../../core/services/reportes.service';
import { map, tap } from 'rxjs';
import { parseCurrency } from '../../../../core/utils/number-utils';
import { exportar } from '../../../../core/constant/dialogs';
import * as XLSX from 'xlsx';
import { AesEncryptionService } from '../../../../core/services/aes-encryption.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadoSolicitudesService } from '../../../../core/services/estado-solicitudes.service';

@Component({
    selector: 'app-reporte-solicitudes',
    standalone: true,
    imports: [
        AsyncPipe,
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
        MatOption,
        MatSelect,
        MatSuffix,
        NgForOf,
        NgIf,
        ReactiveFormsModule,
        NgClass,
    ],
    templateUrl: './reporte-solicitudes.component.html',
    styleUrl: './reporte-solicitudes.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
    ],
})
export class ReporteSolicitudesComponent implements OnInit {
    public searchTerm: string = '';
    private fb = inject(FormBuilder);
    public form: FormGroup;
    private reportesService = inject(ReportesService);
    private datePipe = inject(DatePipe);
    estados = new FormControl(['']);
    data = [];
    private aesEncriptService = inject(AesEncryptionService);
    private estadoSolicitudesService = inject(EstadoSolicitudesService);
    private currencyPipe = inject(CurrencyPipe);
    exportData = [];
    public fuseService = inject(FuseConfirmationService);

    public solicitudes$ = this.estadoSolicitudesService.getEstados().pipe(
        tap((response) => {
            const selectedValue = response.data;
            if (selectedValue) {
                this.form.get('idTipoSolicitud').setValue(selectedValue[0].id);
            }
        }),
    )

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    onSelect(estado: MatSelectChange) {
        const id = estado.value;
        //this.cobros(id);
    }
    ngOnInit(): void {
        this.createForm();
    }

    onConsultar() {
        if (this.form.valid) {
            const { fechaInicio, fechaFinal, ...form } =
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
                ...form,
            };

            console.log(consulta);

            this.reportesService
                .getReporteSolicitudes(consulta)
                .pipe(
                    map((response) => {
                        response.data.forEach((items) => {
                            items.fechaCobro = this.datePipe.transform(
                                items.fechaCobro,
                                'dd/MM/yyyy'
                            );
                            items.fechaInicioContratoTrabajador =
                                this.datePipe.transform(
                                    items.fechaInicioContratoTrabajador,
                                    'dd/MM/yyyy'
                                );
                            items.fechaFinContratoTrabajador =
                                this.datePipe.transform(
                                    items.fechaFinContratoTrabajador,
                                    'dd/MM/yyyy'
                                );

                            if (items.montoCuota) {
                                items.montoCuota =
                                    this.aesEncriptService.decrypt(
                                        items.montoCuota
                                    );
                            }

                            if (items.montoCuotaSinIntereses) {
                                items.montoCuotaSinIntereses =
                                    this.aesEncriptService.decrypt(
                                        items.montoCuotaSinIntereses
                                    );
                            }

                            if (items.interesesGanados) {
                                items.interesesGanados =
                                    this.aesEncriptService.decrypt(
                                        items.interesesGanados
                                    );
                            }

                            items.montoCuota = this.currencyPipe.transform(
                                items.montoCuota,
                                'USD',
                                'symbol',
                                '1.2-2'
                            );
                            items.montoCuotaSinIntereses =
                                this.currencyPipe.transform(
                                    items.montoCuotaSinIntereses,
                                    'USD',
                                    'symbol',
                                    '1.2-2'
                                );
                            items.interesesGanados = parseFloat(
                                items.interesesGanados.replace(',', '.')
                            );
                            items.interesesGanados =
                                this.currencyPipe.transform(
                                    items.interesesGanados,
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
                Trabajador: items.nombreTrabajador,
                Identificación: items.documetoTrabajador,
                TipodeContrato: items.tipoContratoTrabajador,
                Empresa: items.nombreSubEmpresa,
                Iniciodecontrato: items.fechaInicioContratoTrabajador,
                Findecontrato: items.fechaFinContratoTrabajador,
                CantidaddeCuotas: items.numCuota,
                FechaCobro: items.fechaCobro,
                ValorCuota: parseCurrency(items.montoCuota),
                ValorSinIntereses: parseCurrency(items.montoCuotaSinIntereses),
                InteresesGanados: parseCurrency(items.interesesGanados),
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
                    `Reporte cobros trabajadores${this.datePipe.transform(new Date(), 'dd/MM/yyyy')}.xlsx`
                );
            }
        });
    }

    private createForm() {
        this.form = this.fb.group({
            idTipoSolicitud: ['', Validators.required],
            fechaInicio: ['', Validators.required],
            fechaFinal: ['', Validators.required],
        });
    }
}
