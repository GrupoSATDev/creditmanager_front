import { Component, inject, OnInit } from '@angular/core';
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
import { Observable } from 'rxjs';
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
import { tiposCuentas } from '../../../../core/constant/tiposCuentas';
import { NivelRiesgoService } from '../../../../core/services/nivel-riesgo.service';
import { BancosService } from '../../../../core/services/bancos.service';


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

    public departamentos$ = this._locacionService.getDepartamentos();
    public municipios$: Observable<any>;
    public tiposDocumentos$ = this.tiposDocumentosService.getTiposDocumentos();
    public generos$ = this.generoService.getGeneros();
    public empresasClientes$ = this.empresaClienteService.getEmpresas();
    public cargos$ = this.cargosServices.getCargos();
    public riesgos$ = this.riesgosServices.getRiesgos();
    public bancos$ = this.bancosServices.getBancos();
    public _matData = inject(MAT_DIALOG_DATA);
    public image: any;
    public tiposCuentas = tiposCuentas;

    profile: any = {
        avatar: '',
        name: 'Pedro'
    };

    ngOnInit(): void {
        this.createForm();
        const dialogData = this._matData;
        if (dialogData.edit) {
            const data = dialogData.data;
            //this.form.patchValue(data);
            console.log(data)
            const {idDepartamento, fechaNacimiento, fechaInicioContrato, fechaFinContrato, ...form} = data;
            const fecha = new Date(fechaNacimiento)
            const fechaInicioAntes = new Date(fechaInicioContrato)
            const fechaFinAntes = new Date(fechaFinContrato)
            this.municipios$ = this._locacionService.getMunicipio(idDepartamento);
            this.form.patchValue({
                fechaNacimiento: fecha,
                fechaInicioContrato: new Date(fechaInicioAntes.getFullYear(), fechaInicioAntes.getMonth(), fechaInicioAntes.getDate()),
                fechaFinContrato: new Date(fechaFinAntes.getFullYear(), fechaFinAntes.getMonth(), fechaFinAntes.getDate()),
                ...form
            })
            console.log(this.form.getRawValue())
            //this.riesgos$ = this.riesgosServices.getRiesgo(idNivelRiesgo);
            //this.bancos$ = this.bancosServices.getBanco(idBanco);
            this.image = `data:image/png;base64,  ${data.foto}`;
        }
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];

            // Crear un reader para mostrar la imagen cargada
            const reader = new FileReader();
            reader.onload = () => {
                // Settear la imagen cargada en el control de formulario 'foto'
                const image = reader.result as string;
                this.image = image;
                const valueImage = image.split(',')[1]
                this.form.get('foto').setValue(valueImage);
            };
            reader.readAsDataURL(file);
        }
    }

    getMunicipios(matSelectChange: MatSelectChange) {
        const id = matSelectChange.value;
        this.municipios$ = this._locacionService.getMunicipio(id);
    }

    onSave(): void {
        if (this.form.valid) {
            if (!this._matData.edit) {
                const data = this.form.getRawValue();
                const {idDepartamento, fechaNacimiento, fechaInicioContrato, fechaFinContrato,  ...form} = data;
                let fecha = this.datePipe.transform(fechaNacimiento, `dd/MM/yyyy`);
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
                        this.empleadosServices.postEmpleados(createData).subscribe((res) => {
                            console.log(res)
                            this.estadosDatosService.stateGrid.next(true);
                            this.toasService.toasAlertWarn({
                                message: 'Registro creado con exito!',
                                actionMessage: 'Cerrar',
                                duration: 3000
                            })
                            this.closeDialog();
                        })
                    }else {
                        this.closeDialog();
                    }
                })
            }else {
                const data = this.form.getRawValue();
                const {idDepartamento, fechaNacimiento, fechaInicioContrato, fechaFinContrato,  ...form} = data;
                let fecha = this.datePipe.transform(fechaNacimiento, `dd/MM/yyyy`);
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
                            this.toasService.toasAlertWarn({
                                message: 'Registro actualizado con exito!',
                                actionMessage: 'Cerrar',
                                duration: 3000
                            })
                            this.closeDialog();
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
            salarioDevengado: [''],
            capacidadEndeudamiento: [''],
            idNivelRiesgo: [''],
            idBanco: [''],
            idTipoCuenta: [''],
            foto: [''],
            firma: [''],
            idSubEmpresa: [''],
        })
    }

    closeDialog() {
        this.dialogRef.close();
    }

}
