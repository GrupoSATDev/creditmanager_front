import { Component, inject, OnInit } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { LocacionService } from '../../../../core/services/locacion.service';
import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmpresasMaestrasService } from '../../../../core/services/empresas-maestras.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { guardar } from '../../../../core/constant/dialogs';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';

@Component({
  selector: 'app-form-empresas',
  standalone: true,
    imports: [
        MatFormField,
        MatInput,
        MatButton,
        MatIconButton,
        MatLabel,
        MatSelect,
        MatOption,
        NgIf,
        AsyncPipe,
        NgForOf,
        ReactiveFormsModule,
        JsonPipe,
    ],
  templateUrl: './form-empresas.component.html',
  styleUrl: './form-empresas.component.scss'
})
export class FormEmpresasComponent implements OnInit{

    private fb = inject(FormBuilder);
    public form: FormGroup;
    private _locacionService = inject(LocacionService);
    private empresasService = inject(EmpresasMaestrasService);
    public dialogRef = inject(MatDialogRef<FormEmpresasComponent>);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public toasService = inject(ToastAlertsService);

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
    public municipios$: Observable<any>;
    public _matData = inject(MAT_DIALOG_DATA);

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
            this.form.patchValue(data);
            const {idDepartamento} = data;
            this.municipios$ = this._locacionService.getMunicipio(idDepartamento);
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
            idMunicipio: [''],
            procMaxPrestamo: [''],
            procMaxDesembolso: [''],
        })
    }

    onSave() {
        if (this.form.valid) {
            if (!this._matData.edit) {
                const data = this.form.getRawValue();
                const {idDepartamento, ...form} = data;
                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.empresasService.postEmpresa(form).subscribe((res) => {
                            console.log(res)
                            this.estadosDatosService.stateGrid.next(true);
                            this.toasService.toasAlertWarn({
                                message: 'Registro Creado o Actualizado con Exito.',
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
                const {idDepartamento, ...form} = data;
                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.empresasService.putEmpresa(form).subscribe((res) => {
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

    closeDialog() {
        this.dialogRef.close();
    }



}
