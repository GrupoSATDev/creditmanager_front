import { Component } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatOption, MatSelect } from '@angular/material/select';

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
    ],
  templateUrl: './form-empresas.component.html',
  styleUrl: './form-empresas.component.scss'
})
export class FormEmpresasComponent {

}
