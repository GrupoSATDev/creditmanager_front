import { Routes } from '@angular/router';
import { GridCreditosComponent } from './grid-creditos/grid-creditos.component';
import { FormDetalleComponent } from './form-detalle/form-detalle.component';

export default [
    {
        path: '',
        component: GridCreditosComponent
    },
    {
        path: 'detalle/:id',
        component: FormDetalleComponent
    }
]as Routes;
