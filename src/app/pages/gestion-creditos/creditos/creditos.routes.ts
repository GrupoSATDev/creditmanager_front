import { Routes } from '@angular/router';
import { GridCreditosComponent } from './grid-creditos/grid-creditos.component';
import { FormDetalleComponent } from './form-detalle/form-detalle.component';
import { FormViewDetalleComponent } from './form-view-detalle/form-view-detalle.component';

export default [
    {
        path: '',
        component: GridCreditosComponent
    },
    {
        path: 'detalle/:id',
        component: FormDetalleComponent
    },
    {
        path: 'view-detalle/:id',
        component: FormViewDetalleComponent
    }
]as Routes;
