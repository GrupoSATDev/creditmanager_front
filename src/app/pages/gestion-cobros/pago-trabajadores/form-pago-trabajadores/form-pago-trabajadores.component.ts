import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DateAdapter, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { Router } from '@angular/router';
import { EmpresasClientesService } from '../../../../core/services/empresas-clientes.service';
import { DetalleConsumoService } from '../../../../core/services/detalle-consumo.service';
import { PagoAliadosService } from '../../../../core/services/pago-aliados.service';
import { SwalService } from '../../../../core/services/swal.service';
import { map } from 'rxjs';
import { confirmarPago } from '../../../../core/constant/dialogs';
import { PagoTrabajadoresService } from '../../../../core/services/pago-trabajadores.service';
import { CobroTrabajadoresService } from '../../../../core/services/cobro-trabajadores.service';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { IConfig, provideNgxMask } from 'ngx-mask';
import { AesEncryptionService } from '../../../../core/services/aes-encryption.service';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-pago-trabajadores',
  standalone: true,
    imports: [
        AsyncPipe,
        CurrencyPipe,
        CustomTableComponent,
        FormsModule,
        FuseAlertComponent,
        MatButton,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatFormField,
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
  templateUrl: './form-pago-trabajadores.component.html',
  styleUrl: './form-pago-trabajadores.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
        provideNgxMask(maskConfig)
    ],
})
export class FormPagoTrabajadoresComponent implements OnInit{
    private fb = inject(FormBuilder);
    public form: FormGroup;
    private empresaClienteService = inject(EmpresasClientesService)
    private pagoTrabajadorService = inject(PagoTrabajadoresService);
    private cobroTrabajadorService = inject(CobroTrabajadoresService);
    private datePipe = inject(DatePipe);
    private swalService = inject(SwalService);
    public estadosDatosService = inject(EstadosDatosService);
    public fuseService = inject(FuseConfirmationService);
    private currencyPipe = inject(CurrencyPipe);
    private decimalPipe =  inject(DecimalPipe)
    private router = inject(Router);
    public message: string;
    idTipoPagoTrabajador: any;
    empresa$ = this.empresaClienteService.getEmpresasClientes();
    tipoPago$ = this.pagoTrabajadorService.tipoPagoTrabajadores().subscribe((response) => {
        this.idTipoPagoTrabajador = response.data[0].id;
    })
    data = [];
    totalPagar: number;
    totalComision: number;
    subtotal: number;
    fechaActual: Date = new Date();
    private aesEncriptService = inject(AesEncryptionService);

    columns = ['Fecha de desembolso', 'Identificación', 'Nombres Apellidos', 'Valor pendiente'  ];
    columnPropertyMap = {
        'Fecha de desembolso': 'fechaCreacion',
        'Identificación': 'documentoTrabajador',
        'Nombres Apellidos': 'nombreCompleto',
        'Valor pendiente': 'valorPendiente',
    };

    buttons: IButton[] = [
        {
            label: 'Eliminar',
            icon: 'delete',
            action: this.deleteItem.bind(this),
            iconColor: 'text-crediorange-100'
        },
    ];

    private createForm() {
        this.form = this.fb.group({
            fechaFinal: ['', Validators.required],
            idSubEmpresa: ['', Validators.required],
            idTipoPagoTrabajador: [''],
        })

    }

    ngOnInit(): void {
        this.createForm();
    }

    closeDialog() {
        this.router.navigate(['/pages/gestion-cobros/trabajadores']);
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

            this.getAllPagoTrabajador(consulta);

        }
    }

    onSave() {
        const {fechaFinal, idSubEmpresa, idTipoPagoTrabajador } = this.form.getRawValue();

        const fechaFinallData = this.datePipe.transform(fechaFinal, 'yyyy-MM-dd');

        const consulta = {
            fechaFinal: fechaFinallData,
            idSubEmpresa
        }

        let detallePagoTrabajador = []
        detallePagoTrabajador = this.data.map((item) => {
            return {
                idCobroTrabajador: item.id
            }
        })

        const createData = {
            ...consulta,
            detallePagoTrabajador
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

    private getAllPagoTrabajador(data) {
        this.cobroTrabajadorService.getCobroTrabajadores(data).pipe(
            map((response) => {
                this.subtotal = 0;
                this.totalComision = 0;
                this.totalPagar = 0;
                if (response && Array.isArray(response.data)) {
                    response.data.forEach((items) => {
                        if (items.montoCuota) {
                            items.montoCuota = this.aesEncriptService.decrypt(items.montoCuota);
                        }
                        if (items.valorPendiente) {
                            items.valorPendiente = this.aesEncriptService.decrypt(items.valorPendiente);
                        }

                        //items.comision = ((items.montoConsumo * items.porcentajeSubEmpresa) / 100);
                        //items.pagar = (items.montoConsumo - items.comision);
                        items.montoCuota = this.currencyPipe.transform(items.montoCuota, 'USD', 'symbol', '1.2-2');
                        //items.comision = this.currencyPipe.transform(items.comision, 'USD', 'symbol', '1.2-2');
                        items.pagar = this.currencyPipe.transform(items.pagar, 'USD', 'symbol', '1.2-2');
                        items.valorPendiente = this.currencyPipe.transform(items.valorPendiente, 'USD', 'symbol', '1.2-2');
                        //items.porcentajeSubEmpresa = this.decimalPipe.transform(items.porcentajeSubEmpresa, '1.2-2') + '%';
                        items.fechaCobro = this.datePipe.transform(items.fechaCobro, 'dd/MM/yyyy');
                        items.fechaCreacion = this.datePipe.transform(items.fechaCreacion, 'dd/MM/yyyy');

                        //this.subtotal += parseFloat(items.montoCuota.replace(/[^0-9.-]+/g, ''));
                        //this.totalComision += parseFloat(items.comision.replace(/[^0-9.-]+/g, ''));
                        this.totalPagar += parseFloat(items.montoCuota.replace(/[^0-9.-]+/g, ''));
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
        this.pagoTrabajadorService.postPagosTrabajadores(data).subscribe((response) => {
            this.swalService.ToastAler({
                icon: 'success',
                title: 'Registro Creado o Actualizado con Exito.',
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

    deleteItem(item: any): void {
        const index = this.data.findIndex((d) => d === item);
        if (index > -1) {
            // Extraer el valor numérico de `montoCuota` antes de eliminar el item
            const montoCuota = parseFloat(item.montoCuota.replace(/[^0-9.-]+/g, ''));

            // Restar el valor eliminado del totalPagar
            this.totalPagar -= isNaN(montoCuota) ? 0 : montoCuota;

            // Eliminar el item de la lista
            this.data.splice(index, 1);
            this.data = [...this.data]; // Para disparar detección de cambios en Angular
        }
    }


}
