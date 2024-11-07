import { Component } from '@angular/core';
import { FuseCardComponent } from '../../../../../@fuse/components/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-subscripciones',
  standalone: true,
    imports: [
        FuseCardComponent,
        RouterLink,
    ],
  templateUrl: './main-subscripciones.component.html',
  styleUrl: './main-subscripciones.component.scss'
})
export class MainSubscripcionesComponent {

}
