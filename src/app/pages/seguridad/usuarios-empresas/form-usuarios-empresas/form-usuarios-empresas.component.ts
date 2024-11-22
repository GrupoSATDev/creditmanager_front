import { Component, inject, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { Observable, tap } from 'rxjs';
import { LocacionService } from '../../../../core/services/locacion.service';
import { UsuariosService } from '../../../../core/services/usuarios.service';
import { TipoUsuariosService } from '../../../../core/services/tipo-usuarios.service';
import { RolesService } from '../../../../core/services/roles.service';
import { EmpresasClientesService } from '../../../../core/services/empresas-clientes.service';
import { guardar } from '../../../../core/constant/dialogs';
import { SwalService } from '../../../../core/services/swal.service';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-form-usuarios-empresas',
  standalone: true,
    imports: [
        FormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        AsyncPipe,
        MatOption,
        MatSelect,
        NgForOf,
        NgIf,
        MatButton,
        MatIcon,
        MatIconButton,
        MatError,
        MatSlideToggle,
    ],
  templateUrl: './form-usuarios-empresas.component.html',
  styleUrl: './form-usuarios-empresas.component.scss'
})
export class FormUsuariosEmpresasComponent  implements OnInit{
    private fb = inject(FormBuilder);
    public form: FormGroup;
    private _locacionService = inject(LocacionService);
    public dialogRef = inject(MatDialogRef<FormUsuariosEmpresasComponent>);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    public usuariosService = inject(UsuariosService);
    public tipoUsuariosService = inject(TipoUsuariosService);
    public empresaClienteService = inject(EmpresasClientesService);
    public rolesService = inject(RolesService);
    public municipios$: Observable<any>;
    public _matData = inject(MAT_DIALOG_DATA);
    private swalService = inject(SwalService);

    onSelected(matSelectChange: MatSelectChange) {
        const id = matSelectChange.value;
        this.getMunicipios(id);
    }

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

    public tipoUsuarios$ = this.tipoUsuariosService.getTipoUsuarios().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idTipoUsuario').setValue(valorSelected[0].id)
            }
        })
    );

    public roles$ = this.rolesService.getRoles().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idRol').setValue(valorSelected[0].id)
            }
        })
    );

    public empresas$ = this.empresaClienteService.getEmpresasClientesSelect().pipe(
        tap((response) => {
            const valorSelected = response.data;
            const dialogData = this._matData;
            if (valorSelected && !dialogData.edit) {
                this.form.get('idSubEmpresa').setValue(valorSelected[0].id)
            }
        })
    );

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
            this.getUsuario(data.id)
        }
    }

    private createForm() {
        this.form = this.fb.group({
            id: [null],
            nombre: ['', [Validators.required]],
            apellido: ['', [Validators.required]],
            correo: ['', [Validators.required]],
            contrasena: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
            confirmaContrasena: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
            idRol: [''],
            idSubEmpresa: [''],
            idTipoUsuario: [''],
            idDepartamento: [''],
            idMunicipio: [''],
            estado: [true],
        },
            { validators: passwordMatchValidator('contrasena', 'confirmaContrasena') })
    }

    onSave() {
        if (this.form.valid) {
            if (!this._matData.edit) {
                const data = this.form.getRawValue();
                const {idDepartamento, confirmaContrasena, ...form} = data;
                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.usuariosService.postUsuarios(form).subscribe((res) => {
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
                const {idDepartamento, confirmaContrasena, ...form} = data;
                const dialog = this.fuseService.open({
                    ...guardar
                });

                dialog.afterClosed().subscribe((response) => {

                    if (response === 'confirmed') {
                        this.usuariosService.putUsuario(form).subscribe((res) => {
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

            }
        }

    }

    private getUsuario(id) {
        this.usuariosService.getUsuario(id).subscribe((response) => {
            if (response) {
                console.log(response.data)
                const { idDepartamento, ...data } = response.data;
                this.form.patchValue({
                    idDepartamento,
                    ...data,
                })
                this.municipios$ = this._locacionService.getMunicipio(idDepartamento);
            }
        })
    }

    closeDialog() {
        this.dialogRef.close();
    }

}

export function passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl) => {
        const control = formGroup.get(controlName);
        const matchingControl = formGroup.get(matchingControlName);

        if (matchingControl?.errors && !matchingControl.errors['passwordMismatchError']) {
            return null; // Return if another validator has already found an error
        }

        // Set error on matchingControl if validation fails
        if (control?.value !== matchingControl?.value) {
            matchingControl?.setErrors({ passwordMismatchError: true });
        } else {
            matchingControl?.setErrors(null);
        }
        return null;
    };
}
