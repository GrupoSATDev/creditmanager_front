import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { LocacionService } from '../../../../core/services/locacion.service';
import { EmpresasMaestrasService } from '../../../../core/services/empresas-maestras.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { Observable } from 'rxjs';
import { guardar } from '../../../../core/constant/dialogs';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { TiposEmpresasService } from '../../../../core/services/tipos-empresas.service';
import { EmpresasClientesService } from '../../../../core/services/empresas-clientes.service';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';

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
        MatFormFieldModule
    ],
    providers: [
        {
            provide: DateAdapter, useClass: DateAdapterService,
        },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
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

    public departamentos$ = this._locacionService.getDepartamentos();
    public empresas$ = this.empresasService.getEmpresas();
    public municipios$: Observable<any>;
    public tiposEmpresas$ = this.tiposEmpresaService.getTiposEmpresas();
    public _matData = inject(MAT_DIALOG_DATA);

    getMunicipios(matSelectChange: MatSelectChange) {
        const id = matSelectChange.value;
        this.municipios$ = this._locacionService.getMunicipio(id);
    }

    ngOnInit(): void {
        this.createForm();
        const dialogData = this._matData;
        if (dialogData.edit) {
            const data = dialogData.data;
            this.form.patchValue(data);
            const {idDepartamento} = data;
            this.municipios$ = this._locacionService.getMunicipio(idDepartamento);
        }

    }

    onSave() {
        if (this.form.valid) {
            if (!this._matData.edit) {
                const data = this.form.getRawValue();
                const {idDepartamento, idEmpresa, ...form} = data;
                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.empresaClienteService.postEmpresaCliente(form).subscribe((res) => {
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
                const {idDepartamento,  ...form} = data;
                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.empresaClienteService.putEmpresaCliente(form).subscribe((res) => {
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
            nit: [''],
            razonSocial: [''],
            correo: [''],
            telefono: [''],
            direccion: [''],
            idDepartamento: [''],
            idTipoEmpresa: [''],
            idMunicipio: [''],
            idEmpresa: [''],
            fechaCorte: [''],
            estado: [true],
        })
    }

    closeDialog() {
        this.dialogRef.close();
    }



}
