import { Component } from '@angular/core';
import { MatStep, MatStepper, MatStepperNext } from '@angular/material/stepper';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-form-detalle-consumo',
  standalone: true,
    imports: [
        MatStepper,
        MatStep,
        FormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        MatButton,
        MatStepperNext,
    ],
  templateUrl: './form-detalle-consumo.component.html',
  styleUrl: './form-detalle-consumo.component.scss'
})
export class FormDetalleConsumoComponent {

}
