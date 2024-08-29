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
            this.empresasService.postEmpresa(data).subscribe((res) => {
                console.log(res)
                this.closeDialog();
            })
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }



}
