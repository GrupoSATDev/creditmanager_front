import { Component, inject } from '@angular/core';
import { FuseCardComponent } from '../../../../../@fuse/components/card';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-main-detalle-consumo',
  standalone: true,
    imports: [
        FuseCardComponent,
        RouterLink,
    ],
  templateUrl: './main-detalle-consumo.component.html',
  styleUrl: './main-detalle-consumo.component.scss'
})
export class MainDetalleConsumoComponent {
    public _authService: AuthService = inject(AuthService);

}
