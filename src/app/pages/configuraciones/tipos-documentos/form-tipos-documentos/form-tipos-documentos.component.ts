import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-form-tipos-documentos',
  standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        MatButton,
    ],
  templateUrl: './form-tipos-documentos.component.html',
  styleUrl: './form-tipos-documentos.component.scss'
})
export class FormTiposDocumentosComponent {

}
