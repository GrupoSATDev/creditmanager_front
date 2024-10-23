import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatOption, MatSelect } from '@angular/material/select';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { IConfig, provideNgxMask } from 'ngx-mask';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { EmpresasClientesService } from '../../../../core/services/empresas-clientes.service';
import { DetalleConsumoService } from '../../../../core/services/detalle-consumo.service';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { SwalService } from '../../../../core/services/swal.service';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { PagoAliadosService } from '../../../../core/services/pago-aliados.service';
import { confirmarPago, guardar } from '../../../../core/constant/dialogs';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-aliados',
  standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatFormField,
        MatInput,
        MatLabel,
        MatSuffix,
        AsyncPipe,
        MatOption,
        MatSelect,
        NgForOf,
        NgIf,
        MatButton,
        CustomTableComponent,
        NgClass,
        CurrencyPipe,
        FuseAlertComponent,
    ],
  templateUrl: './form-aliados.component.html',
  styleUrl: './form-aliados.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
        provideNgxMask(maskConfig)
    ],
})
export class FormAliadosComponent implements OnInit{
    private fb = inject(FormBuilder);
    public form: FormGroup;
    private empresaClienteService = inject(EmpresasClientesService)
    private detalleConsumoService = inject(DetalleConsumoService);
    private pagoAliadoService = inject(PagoAliadosService);
    private datePipe = inject(DatePipe);
    private swalService = inject(SwalService);
    public estadosDatosService = inject(EstadosDatosService);
    public fuseService = inject(FuseConfirmationService);
    private currencyPipe = inject(CurrencyPipe);
    private decimalPipe =  inject(DecimalPipe)
    private router = inject(Router);
    public message: string;

    empresa$ = this.empresaClienteService.getEmpresasClientes();
    data = [];
    totalPagar: number;
    totalComision: number;
    subtotal: number;

    columns = ['Número de factura', 'Porcentaje', 'Valor', 'Comision', 'Total a Pagar', ];
    columnPropertyMap = {
        'Número de factura': 'numeroFactura',
        'Porcentaje': 'porcentajeSubEmpresa',
        'Valor': 'montoConsumo',
        'Comision': 'comision',
        'Total a Pagar': 'pagar'
    };


    private createForm() {
        this.form = this.fb.group({
            fechaFinal: ['', Validators.required],
            idSubEmpresa: ['', Validators.required],
        })

    }

    ngOnInit(): void {
        this.createForm();
    }

    closeDialog() {
        this.router.navigate(['/pages/gestion-cobros/aliados']);;
    }

    onGet() {
        if (this.form.valid) {
            const {fechaFinal, idSubEmpresa } = this.form.getRawValue();
            console.log(fechaFinal)

            const fechaFinallData = this.datePipe.transform(fechaFinal, 'yyyy-MM-dd')

            const consulta = {
                fechaFinallData,
                idSubEmpresa
            }

            this.getAllPago(consulta);

        }
    }

    onSave() {
        const {fechaFinal, idSubEmpresa } = this.form.getRawValue();

        const fechaFinallData = this.datePipe.transform(fechaFinal, 'yyyy-MM-dd');

        const consulta = {
            fechaFinal: fechaFinallData,
            idSubEmpresa
        }

        let detallePagoAliado = []
        detallePagoAliado = this.data.map((item) => {
            return {
                idDetalleConsumo: item.id
            }
        })

        const createData = {
            ...consulta,
            detallePagoAliado
        }

        console.log(createData)
        const dialog = this.fuseService.open({
            ...confirmarPago
        });

        dialog.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                this.postSave(createData)
            }
        })
    }

    private getAllPago(data) {
        this.detalleConsumoService.getPagosAliados(data).pipe(
            map((response) => {
                this.subtotal = 0;
                this.totalComision = 0;
                this.totalPagar = 0;
                if (response && Array.isArray(response.data)) {
                    response.data.forEach((items) => {
                        items.comision = ((items.montoConsumo * items.porcentajeSubEmpresa) / 100);
                        items.pagar = (items.montoConsumo - items.comision);
                        items.montoConsumo = this.currencyPipe.transform(items.montoConsumo, 'USD', 'symbol', '1.2-2');
                        items.comision = this.currencyPipe.transform(items.comision, 'USD', 'symbol', '1.2-2');
                        items.pagar = this.currencyPipe.transform(items.pagar, 'USD', 'symbol', '1.2-2');
                        items.porcentajeSubEmpresa = this.decimalPipe.transform(items.porcentajeSubEmpresa, '1.2-2') + '%';

                        this.subtotal += parseFloat(items.montoConsumo.replace(/[^0-9.-]+/g, ''));
                        this.totalComision += parseFloat(items.comision.replace(/[^0-9.-]+/g, ''));
                        this.totalPagar += parseFloat(items.pagar.replace(/[^0-9.-]+/g, ''));
                    });
                }else {
                    this.data = [];
                }
                return response
            })

        ).subscribe((response) => {
            if (response && Array.isArray(response.data)) {
                this.data = response.data;
            }else {
                this.data = [];
                this.message = response.msg;
            }
        })
    }

    private postSave(data) {
        this.pagoAliadoService.postAliados(data).subscribe((response) => {
            this.swalService.ToastAler({
                icon: 'success',
                title: 'Registro creado con exito!',
                timer: 4000,
            })
            this.estadosDatosService.stateGrid.next(true);
            this.closeDialog();
        }, error => {
            this.swalService.ToastAler({
                icon: 'error',
                title: 'Ha ocurrido un error al crear el registro!',
                timer: 4000,
            })
        })
    }



}
