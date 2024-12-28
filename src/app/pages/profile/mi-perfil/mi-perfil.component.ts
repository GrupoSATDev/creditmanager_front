import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { EmpleadosService } from '../../../core/services/empleados.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { guardar } from '../../../core/constant/dialogs';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';
import { SwalService } from '../../../core/services/swal.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormField,
        MatIcon,
        MatInput,
        MatDialogClose,
        MatButton,
        MatIconButton,
        MatLabel,
        MatError
    ],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.scss'
})
export class MiPerfilComponent implements OnInit{
    private fb = inject(FormBuilder);
    public form: FormGroup;
    public subcription$: Subscription;
    private usuarioService = inject(UsuariosService);
    public fuseService = inject(FuseConfirmationService);
    private swalService = inject(SwalService);
    public dialogRef = inject(MatDialogRef<MiPerfilComponent>);

    private createForm() {
        this.form = this.fb.group({
                id: [null],
                nombre: [''],
                apellido: [''],
                idMunicipio: [''],
                contrasena: ['', [Validators.minLength(5), Validators.maxLength(20)]],
                confirmaContrasena: ['', [Validators.minLength(5), Validators.maxLength(20)]],
            },
            { validators: passwordMatchValidator('contrasena', 'confirmaContrasena') })


    }

    ngOnInit(): void {
        this.createForm();
        this.getPerfil();
    }

    getPerfil() {
        this.subcription$ = this.usuarioService.getUsuarioComun().subscribe((response) => {
            const empleado = response.data;
            this.form.patchValue(empleado);
        })
    }

    onSave() {
        if (this.form.valid) {
            const data = this.form.getRawValue();

            const dialog = this.fuseService.open({
                ...guardar
            });

            dialog.afterClosed().subscribe((response) => {

                if (response === 'confirmed') {
                    this.usuarioService.putUsuarioComunes(data).subscribe((res) => {
                        console.log(res)
                        this.swalService.ToastAler({
                            icon: 'success',
                            title: 'Registro Actualizado con Exito.',
                            timer: 4000,
                        })
                        this.closeDialog();
                    }, error => {
                        this.swalService.ToastAler({
                            icon: 'error',
                            title: 'Ha ocurrido un error en actualizar el registro!',
                            timer: 4000,
                        })
                    })
                }else {
                    this.closeDialog();
                }
            })


        }
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
