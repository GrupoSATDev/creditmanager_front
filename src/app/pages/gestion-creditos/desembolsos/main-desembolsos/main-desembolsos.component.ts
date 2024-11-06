import { Component } from '@angular/core';
import { FuseCardComponent } from '../../../../../@fuse/components/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-desembolsos',
  standalone: true,
    imports: [
        FuseCardComponent,
        RouterLink,
    ],
  templateUrl: './main-desembolsos.component.html',
  styleUrl: './main-desembolsos.component.scss'
})
export class MainDesembolsosComponent {

}
