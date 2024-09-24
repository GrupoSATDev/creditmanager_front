import { Component, EventEmitter, Output } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-terminos-condiciones',
  standalone: true,
    imports: [
        MatCheckbox,
        CdkScrollable,
    ],
  templateUrl: './terminos-condiciones.component.html',
  styleUrl: './terminos-condiciones.component.scss'
})
export class TerminosCondicionesComponent {
    aceptado = false;

    @Output() aceptacionCambiada = new EventEmitter<boolean>();

    toggleAceptar(event: any) {
        this.aceptado = event.checked;
        this.aceptacionCambiada.emit(this.aceptado);
    }

}
