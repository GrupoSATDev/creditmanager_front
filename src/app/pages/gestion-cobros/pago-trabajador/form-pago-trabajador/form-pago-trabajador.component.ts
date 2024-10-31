import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatOption, MatSelect } from '@angular/material/select';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { EmpresasClientesService } from '../../../../core/services/empresas-clientes.service';
import { PagoTrabajadoresService } from '../../../../core/services/pago-trabajadores.service';
import { CobroTrabajadoresService } from '../../../../core/services/cobro-trabajadores.service';
import { SwalService } from '../../../../core/services/swal.service';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { Router } from '@angular/router';
import { confirmarPago } from '../../../../core/constant/dialogs';
import { map, Observable, tap } from 'rxjs';
import { EmpleadosService } from '../../../../core/services/empleados.service';
const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-pago-trabajador',
  standalone: true,
    imports: [
        AsyncPipe,
        CurrencyPipe,
        CustomTableComponent,
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
        NgxMaskDirective,
        MatError,
        JsonPipe,
    ],
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
        provideNgxMask(maskConfig)
    ],
  templateUrl: './form-pago-trabajador.component.html',
  styleUrl: './form-pago-trabajador.component.scss'
})
export class FormPagoTrabajadorComponent  implements OnInit{
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
    public selectOptionValue: any;
    private empleadosService = inject(EmpleadosService);

    empresa$ = this.empresaClienteService.getEmpresasClientes().pipe(
        tap((response) => {
            const valorSelected = response.data;
            if (valorSelected) {
                this.form.get('idSubEmpresa').setValue(valorSelected[0].id)
                this.getEmpleadosSubEmpresas(valorSelected[0].id)
            }
        })
    )
    tipoPago$ = this.pagoTrabajadorService.tipoPagoTrabajadores().pipe(
        tap((response) => {
            const valorSelected = response.data;
            if (valorSelected) {
                this.selectOptionValue = valorSelected
            }
        })
    )
    empleados$: Observable<any>;
    data = [];
    totalPagar: number;
    totalComision: number;
    subtotal: number;

    columns = ['Número de identificación', 'Valor pendiente', 'Fecha de cobro' ];
    columnPropertyMap = {
        'Número de identificación': 'documentoTrabajador',
        'Valor pendiente': 'valorPendiente',
        'Fecha de cobro': 'fechaCobro',
    };

    private createForm() {
        this.form = this.fb.group({
            fechaFinal: ['', Validators.required],
            idSubEmpresa: ['', Validators.required],
            idTipoPagoTrabajador: ['', Validators.required],
            idTrabajador: ['', Validators.required],
            valorAbono: ['', [this.maxAmountValidator.bind(this)]],
            observacion: [''],
        })

    }

    ngOnInit(): void {
        this.createForm();
        this.form.get('valorAbono').valueChanges.subscribe((response) => {
            console.log(response)
            if (response == 0) {
                this.form.get('valorAbono').setValidators([Validators.required, this.maxAmountValidator.bind(this)])
                //this.actualizaSelected(response)
                this.form.updateValueAndValidity()
            }else if (response > 0) {
                this.actualizaSelected(response);
            }
        })
    }

    actualizaSelected(inputValue: number) {
        if (inputValue === this.totalPagar) {
            console.log('Si entra al actualizar')
            this.form.get('idTipoPagoTrabajador').setValue(this.selectOptionValue[0].id)
        }else if (inputValue < this.totalPagar) {
            console.log('Si entra al actualizar 2')
            this.form.get('idTipoPagoTrabajador').setValue(this.selectOptionValue[1].id)
        }
    }

    get valorAbono() {
        return this.form.get('valorAbono');
    }

    maxAmountValidator(control: AbstractControl): ValidationErrors | null {

        if (control.value === null || control.value === undefined || control.value === '') {
            return null; // Permite que Validators.required gestione los casos de campo vacío.
        }

        console.log(control.value)

        const amount = parseFloat(control.value.toString().replace(/,/g, ''));
        console.log(amount)

        if (amount === 0) {
            return {valueZero: true}
        }

        if (amount > this.totalPagar) {
            console.log('Si entra')
            return { exceedsBalance: true };
        }

        return null;
    }

    closeDialog() {
        this.router.navigate(['/pages/gestion-cobros/trabajador']);
    }

    getEmpleadosSubEmpresas(id) {
        this.empleados$ = this.empleadosService.getEmpleadosSubempresas(id)
    }

    onGet() {
        if (this.form.valid) {
            const {fechaFinal, idSubEmpresa, idTrabajador } = this.form.getRawValue();


            const fechaFinallData = this.datePipe.transform(fechaFinal, 'yyyy-MM-dd')

            const consulta = {
                fechaFinallData,
                idSubEmpresa,
                idTrabajador
            }

            console.log(consulta)

            this.getAllPagoTrabajador(consulta);

        }
    }

    onSave() {
        const {fechaFinal, idSubEmpresa, idTrabajador, idTipoPagoTrabajador } = this.form.getRawValue();

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
            idTipoPagoTrabajador,
            detallePagoTrabajador,
            idTrabajador
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
        this.cobroTrabajadorService.getCobroTrabajador(data).pipe(
            map((response) => {
                this.subtotal = 0;
                this.totalComision = 0;
                this.totalPagar = 0;
                if (response && Array.isArray(response.data)) {
                    response.data.forEach((items) => {
                        items.montoCuota = this.currencyPipe.transform(items.montoCuota, 'USD', 'symbol', '1.2-2');
                        items.comision = this.currencyPipe.transform(items.comision, 'USD', 'symbol', '1.2-2');
                        items.pagar = this.currencyPipe.transform(items.pagar, 'USD', 'symbol', '1.2-2');
                        items.valorPendiente = this.currencyPipe.transform(items.valorPendiente, 'USD', 'symbol', '1.2-2');
                        //items.porcentajeSubEmpresa = this.decimalPipe.transform(items.porcentajeSubEmpresa, '1.2-2') + '%';
                        items.fechaCobro = this.datePipe.transform(items.fechaCobro, 'dd/MM/yyyy');

                        //this.subtotal += parseFloat(items.montoConsumo.replace(/[^0-9.-]+/g, ''));
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
        this.pagoTrabajadorService.postPagoTrabajador(data).subscribe((response) => {
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



}
