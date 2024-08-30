import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-capital-inversion',
  standalone: true,
    imports: [
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
    ],
  templateUrl: './form-capital-inversion.component.html',
  styleUrl: './form-capital-inversion.component.scss'
})
export class FormCapitalInversionComponent {

}
