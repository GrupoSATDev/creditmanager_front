import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { AsyncPipe, DatePipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { TiposDocumentosService } from '../../../../core/services/tipos-documentos.service';
import { combineLatestWith, map, Observable, tap } from 'rxjs';
import { LocacionService } from '../../../../core/services/locacion.service';
import { GenerosService } from '../../../../core/services/generos.service';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { EmpresasClientesService } from '../../../../core/services/empresas-clientes.service';
import { MatIcon } from '@angular/material/icon';
import { guardar } from '../../../../core/constant/dialogs';
import { EmpleadosService } from '../../../../core/services/empleados.service';
import { CargosService } from '../../../../core/services/cargos.service';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { IConfig, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NivelRiesgoService } from '../../../../core/services/nivel-riesgo.service';
import { BancosService } from '../../../../core/services/bancos.service';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { SwalService } from '../../../../core/services/swal.service';
import { TipoCuentasService } from '../../../../core/services/tipo-cuentas.service';
import { ContratosService } from '../../../../core/services/contratos.service';
import { DeduccionesService } from '../../../../core/services/deducciones.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VALOR_PORCENTAJE_100, VALOR_PORCENTAJE_30 } from '../../../../core/constant/valores';


const maskConfig: Partial<IConfig> = {
    validation: false,
};

@Component({
  selector: 'app-form-empleados',
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
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatSuffix,
        MatIcon,
        JsonPipe,
        NgxMaskDirective,
        MatSlideToggle,
    ],
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        provideNgxMask(maskConfig)
    ],
  templateUrl: './form-empleados.component.html',
  styleUrl: './form-empleados.component.scss'
})
export class FormEmpleadosComponent implements OnInit{
    private fb = inject(FormBuilder);
    public form: FormGroup;
    public dialogRef = inject(MatDialogRef<FormEmpleadosComponent>);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public toasService = inject(ToastAlertsService);
    private tiposDocumentosService = inject(TiposDocumentosService);
    private _locacionService = inject(LocacionService);
    private generoService = inject(GenerosService);
    private empresaClienteService: EmpresasClientesService = inject(EmpresasClientesService);
    private datePipe = inject(DatePipe);
    private empleadosServices = inject(EmpleadosService)
    private cargosServices = inject(CargosService)
    private riesgosServices = inject(NivelRiesgoService)
    private bancosServices = inject(BancosService)
    private swalService = inject(SwalService);
    private readonly destroyedRef = inject(DestroyRef);
    private porcentajeSalud: number;
    private porcentajePension: number;
    private sumaPorcentaje: number;

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
    )
    public municipios$: Observable<any>;
    public tiposDocumentos$ = this.tiposDocumentosService.getTiposDocumentos().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idTipoDoc').setValue(valorSelected[3].id)
            }
        })
    )
    public generos$ = this.generoService.getGeneros().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idGenero').setValue(valorSelected[1].id)
            }
        })
    )
    public empresasClientes$ = this.empresaClienteService.getEmpresasClientes().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idSubEmpresa').setValue(valorSelected[0].id)
            }
        })
    )
    public cargos$ = this.cargosServices.getCargos();
    public riesgos$ = this.riesgosServices.getRiesgos().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idNivelRiesgo').setValue(valorSelected[0].id)
            }
        })
    )
    public bancos$ = this.bancosServices.getBancos().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idBanco').setValue(valorSelected[0].id)
            }
        })
    )
    public _matData = inject(MAT_DIALOG_DATA);
    public image: any;
    private tipoCuentasService = inject(TipoCuentasService);
    public tipoCuentas$  = this.tipoCuentasService.getTipoCuentas().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idTipoCuenta').setValue(valorSelected[0].id)
            }
        })
    )
    public tipoContratosService = inject(ContratosService);
    public tipoContratos$ = this.tipoContratosService.getContratos().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idTipoContrato').setValue(valorSelected[0].id)
            }
        })
    )

    private deduccioLegalService = inject(DeduccionesService);
    public deduccion$ = this.deduccioLegalService.getDeducciones().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idDeduccionLegal').setValue(valorSelected[0].id)
                this.porcentajeSalud = valorSelected[0].porcentajeSalud;
                this.porcentajePension = valorSelected[0].porcentajePension;
                this.sumaPorcentaje = valorSelected[0].estado ? this.porcentajePension + this.porcentajeSalud : 0;
            }
        })
    )

    profile: any = {
        avatar: '',
        name: 'Pedro'
    };

    ngOnInit(): void {
        this.createForm();
        const dialogData = this._matData;
        if (dialogData.edit) {
            const data = dialogData.data;
            const {estado, idDepartamento, fechaNacimiento, fechaInicioContrato, fechaFinContrato, ...form} = data;
            const fecha = new Date(fechaNacimiento)
            const fechaInicioAntes = new Date(fechaInicioContrato)
            const fechaFinAntes = new Date(fechaFinContrato)
            this.municipios$ = this._locacionService.getMunicipio(idDepartamento);
            this.form.patchValue({
                fechaNacimiento: fecha,
                fechaInicioContrato: new Date(fechaInicioAntes.getFullYear(), fechaInicioAntes.getMonth(), fechaInicioAntes.getDate()),
                fechaFinContrato: new Date(fechaFinAntes.getFullYear(), fechaFinAntes.getMonth(), fechaFinAntes.getDate()),
                idDepartamento,
                estado: estado == 'Activo' ? true : false,
                ...form
            })
            console.log(this.form.getRawValue())
            this.image = `data:image/png;base64,  ${data.foto}`;
        }

       /* const salarioBase$ =  this.form.get('salarioBase').valueChanges
        const otroIngreso$ = this.form.get('otroIngreso').valueChanges

        salarioBase$.pipe(
            combineLatestWith(otroIngreso$),
            map(([valorBase, otroIngreso]) => {
                console.log(valorBase)
                console.log(otroIngreso)
                const salarioDevengado = (valorBase + otroIngreso) - ((valorBase * 8) / 100);

                return salarioDevengado

            })
        ).subscribe((response) => {
            console.log(response)
            this.form.get('salarioDevengado').setValue(response, { emitEvent: false });
        })*/

   /*     combineLatestWith([
           ,

        ]).subscribe(([valorBase, otroValor]) => {
            const salarioDevengado = (valorBase + otroValor) - ((valorBase * 8) / 100);
            this.form.get('salarioDevengado').setValue(salarioDevengado, { emitEvent: false });
        });*/
        this.setCampoValue();

    }

    setCampoValue() {
        this.form.get('salarioBase').valueChanges.pipe(
            takeUntilDestroyed(this.destroyedRef)
        ).subscribe(() => this.calcularCampo());
        this.form.get('otroIngreso').valueChanges.pipe(
            takeUntilDestroyed(this.destroyedRef)
        ).subscribe(() => this.calcularCampo());
    }

    calcularCampo() {
        const valorBase = this.form.get('salarioBase')?.value || 0;
        const otroIngreso = this.form.get('otroIngreso')?.value || 0;
        const devengado = (valorBase + otroIngreso) - (valorBase * this.sumaPorcentaje) / VALOR_PORCENTAJE_100;
        const salud = (valorBase + otroIngreso) * this.porcentajeSalud / VALOR_PORCENTAJE_100;
        const pension = (valorBase + otroIngreso) * this.porcentajePension / VALOR_PORCENTAJE_100;
        const endeudamiento = (devengado) * VALOR_PORCENTAJE_30 / VALOR_PORCENTAJE_100;
        this.form.get('salarioDevengado').setValue(devengado);
        this.form.get('salud').setValue(salud);
        this.form.get('pension').setValue(pension);
        this.form.get('capacidadEndeudamiento').setValue(endeudamiento);
    }



    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];


            const reader = new FileReader();
            reader.onload = () => {

                const image = reader.result as string;
                this.image = image;
                const valueImage = image.split(',')[1]
                this.form.get('foto').setValue(valueImage);
            };
            reader.readAsDataURL(file);
        }
    }

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

    onSave(): void {
        if (this.form.valid) {
            if (!this._matData.edit) {
                const data = this.form.getRawValue();
                const {idDepartamento, fechaNacimiento, fechaInicioContrato, fechaFinContrato, salarioDevengado, salud, pension,  ...form} = data;
                let fecha = this.datePipe.transform(fechaNacimiento, `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`);
                let inicio = this.datePipe.transform(fechaInicioContrato, `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`);
                //let fin = this.datePipe.transform(fechaFinContrato, `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`);
                const createData = {
                    fechaNacimiento: fecha,
                    fechaInicioContrato: inicio,
                    fechaFinContrato: '0001-01-01T00:00:00+00:00',
                    ...form
                }
                console.log(createData)
                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.empleadosServices.postEmpleados(createData).subscribe((res) => {
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
                const {idDepartamento, fechaNacimiento, fechaInicioContrato, fechaFinContrato, salarioDevengado, salud, pension,  ...form} = data;
                let fecha = this.datePipe.transform(fechaNacimiento, `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`);
                let inicio = this.datePipe.transform(fechaInicioContrato, `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`);
                let fin = this.datePipe.transform(fechaFinContrato, `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`);
                const createData = {
                    fechaNacimiento: fecha,
                    fechaInicioContrato: inicio,
                    fechaFinContrato: fin,
                    ...form
                }

                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.empleadosServices.putEmpleados(createData).subscribe((res) => {
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

    private createForm() {
        this.form = this.fb.group({
            id: [null],
            primerNombre: [''],
            segundoNombre: [''],
            primerApellido: [''],
            segundoApellido: [''],
            idTipoDoc: [''],
            numDoc: [''],
            idDepartamento: [''],
            idMunicipio: [''],
            telefono: [''],
            telefono2: [''],
            direccion: [''],
            idGenero: [''],
            correo: [''],
            cargo: [''],
            fechaNacimiento: [''],
            fechaInicioContrato: [''],
            fechaFinContrato: ['null'],
            numCuentaBancaria: [''],
            capacidadEndeudamiento: [{value: 0, disabled: true}],
            idNivelRiesgo: [''],
            idBanco: [''],
            idTipoCuenta: [''],
            foto: [''],
            firma: [''],
            idSubEmpresa: [''],
            idTipoContrato: [''],
            salarioBase: [0],
            otroIngreso: [0],
            idDeduccionLegal: [''],
            salarioDevengado: [{value: 0, disabled: true}],
            salud: [{value: 0, disabled: true}],
            pension: [{value: 0, disabled: true}],
            estado: ['true']
        })
    }

    closeDialog() {
        this.dialogRef.close();
    }

}
