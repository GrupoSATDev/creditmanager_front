import { Component, inject, OnInit } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { LocacionService } from '../../../../core/services/locacion.service';
import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmpresasMaestrasService } from '../../../../core/services/empresas-maestras.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { guardar } from '../../../../core/constant/dialogs';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';

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

    public departamentos$ = this._locacionService.getDepartamentos();
    public municipios$: Observable<any>;

    getMunicipios(matSelectChange: MatSelectChange) {
        const id = matSelectChange.value;
        this.municipios$ = this._locacionService.getMunicipio(id);
    }

    ngOnInit(): void {
        this.createForm();
    }

    private createForm() {
        this.form = this.fb.group({
            nit: [''],
            razonSocial: [''],
            correo: [''],
            telefono: [''],
            direccion: [''],
            idMunicipio: ['']
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
                    this.empresasService.postEmpresa(data).subscribe((res) => {
                        console.log(res)
                        this.estadosDatosService.stateGrid.next(true);
                        this.closeDialog();
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
