import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { LocacionService } from '../../../../core/services/locacion.service';
import { EmpresasMaestrasService } from '../../../../core/services/empresas-maestras.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { Observable, tap } from 'rxjs';
import { guardar } from '../../../../core/constant/dialogs';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { TiposEmpresasService } from '../../../../core/services/tipos-empresas.service';
import { EmpresasClientesService } from '../../../../core/services/empresas-clientes.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { CUSTOM_DATE_FORMATS } from '../../../../core/constant/custom-date-format';
import { SubscripcionService } from '../../../../core/services/subscripcion.service';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { SwalService } from '../../../../core/services/swal.service';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { BancosService } from '../../../../core/services/bancos.service';
import { TipoCuentasService } from '../../../../core/services/tipo-cuentas.service';
import { parseISO } from 'date-fns';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-empresas-clientes',
  standalone: true,
    imports: [
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        AsyncPipe,
        MatOption,
        MatSelect,
        NgForOf,
        NgIf,
        JsonPipe,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatDatepicker,
        MatFormFieldModule,
        NgxMaskDirective,
        MatSlideToggle,
    ],
    providers: [
        DatePipe,
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        provideNgxMask(maskConfig)
    ],
  templateUrl: './form-empresas-clientes.component.html',
  styleUrl: './form-empresas-clientes.component.scss'
})
export class FormEmpresasClientesComponent implements OnInit{

    private fb = inject(FormBuilder);
    public form: FormGroup;
    private _locacionService = inject(LocacionService);
    private empresasService = inject(EmpresasMaestrasService);
    public dialogRef = inject(MatDialogRef<FormEmpresasClientesComponent>);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public toasService = inject(ToastAlertsService);
    public tiposEmpresaService= inject(TiposEmpresasService);
    public empresaClienteService = inject(EmpresasClientesService);
    public subcripciones = inject(SubscripcionService);
    private bancosServices = inject(BancosService)
    private tipoCuentasService = inject(TipoCuentasService);
    public bancos$ = this.bancosServices.getBancos().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idBanco').setValue(valorSelected[0].id)
            }
        })
    )

    public tipoCuentas$  = this.tipoCuentasService.getTipoCuentas().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idTipoCuenta').setValue(valorSelected[0].id)
            }
        })
    )

    public departamentos$ = this._locacionService.getDepartamentos().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idDepartamento').setValue(valorSelected[0].id)
                const idDepto = this.form.get('idDepartamento').value;
                this.getMunicipios(idDepto);
            }
        })
    );

    public empresas$ = this.empresasService.getEmpresas();
    public municipios$: Observable<any>;
    public tiposEmpresas$ = this.tiposEmpresaService.getTiposEmpresas().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idTipoEmpresa').setValue(valorSelected[0].id)
            }
        })
    )
    public subcripciones$ = this.subcripciones.getSubcripciones().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idSubscripcion').setValue(valorSelected[0].id)
            }
        })
    )
    public _matData = inject(MAT_DIALOG_DATA);
    private datePipe = inject(DatePipe);
    private swalService = inject(SwalService);

    onSelected(matSelectChange: MatSelectChange) {
        const id = matSelectChange.value;
        this.getMunicipios(id);
    }

    getMunicipios(id) {
        this.municipios$ = this._locacionService.getMunicipio(id).pipe(
            tap((response) => {
                const valorSelected = response.data;
                const dialogData = this._matData;
                if (valorSelected && !dialogData.edit) {
                    this.form.get('idMunicipio').setValue(valorSelected[0].id)
                }
            })
        )
    }

    ngOnInit(): void {
        this.createForm();
        const dialogData = this._matData;
        if (dialogData.edit) {
            const data = dialogData.data;
            this.getEmpresas(data.id);
        }

    }

    onSave() {
        if (this.form.valid) {
            if (!this._matData.edit) {
                const data = this.form.getRawValue();
                const {idDepartamento, idEmpresa, fechaCobro, porcCobro,  ...form} = data;
                let fecha = this.datePipe.transform(fechaCobro, 'yyyy-MM-dd');
                const createData = {
                    fechaCobro: fecha,
                    porcCobro: parseFloat( porcCobro ),
                    ...form
                }
                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.empresaClienteService.postEmpresaCliente(createData).subscribe((res) => {
                            console.log(res)
                            this.estadosDatosService.stateGrid.next(true);
                            this.swalService.ToastAler({
                                icon: 'success',
                                title: 'Registro Creado o Actualizado con Exito.',
                                timer: 4000,
                            })
                            this.closeDialog();
                        }, error => {
                            this.swalService.ToastAler({
                                icon: 'error',
                                title: 'Ha ocurrido un error al crear el registro!',
                                timer: 4000,
                            })
                        })
                    }else {
                        this.closeDialog();
                    }
                })
            }else {
                const data = this.form.getRawValue();
                const {idDepartamento, fechaCobro, porcCobro,  ...form} = data;
                let fecha = this.datePipe.transform(fechaCobro, 'yyyy-MM-dd');
                const createData = {
                    fechaCobro: fecha,
                    porcCobro: parseFloat(porcCobro),
                    ...form
                }

                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.empresaClienteService.putEmpresaCliente(createData).subscribe((res) => {
                            this.estadosDatosService.stateGrid.next(true);
                            this.swalService.ToastAler({
                                icon: 'success',
                                title: 'Registro actualizado con exito!',
                                timer: 4000,
                            })
                            this.closeDialog();
                        }, error => {
                            this.swalService.ToastAler({
                                icon: 'error',
                                title: 'Ha ocurrido un error al actualizar el registro!',
                                timer: 4000,
                            })
                        })
                    }else {
                        this.closeDialog();
                    }
                })

            }

        }
    }

    public getEmpresas(id) {
        this.empresaClienteService.getEmpresaCliente(id).subscribe((response) => {
            if (response) {
                const data = response.data;
                this.form.patchValue(data);
                const {idDepartamento, fechaCobro, ...form } = data;
                const fecha = parseISO(fechaCobro);
                this.form.patchValue({
                    fechaCobro: fecha,
                    ...form
                })
                this.municipios$ = this._locacionService.getMunicipio(idDepartamento);
            }
        })
    }

    private createForm() {
        this.form = this.fb.group({
            id: [null],
            nit: [''],
            razonSocial: [''],
            correo: [''],
            telefono: [''],
            direccion: [''],
            idDepartamento: [''],
            idTipoEmpresa: [''],
            idMunicipio: [''],
            idSubscripcion: [''],
            valorSuscripcion: [''],
            porcCobro: [''],
            fechaCobro: [''],
            idTipoCuenta: [''],
            idBanco: [''],
            numCuentaBancaria: [''],
            estado: [true],
        })
    }

    closeDialog() {
        this.dialogRef.close();
    }



}
