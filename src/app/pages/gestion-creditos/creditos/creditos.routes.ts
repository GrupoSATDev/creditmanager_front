import { Routes } from '@angular/router';
import { GridCreditosComponent } from './grid-creditos/grid-creditos.component';
import { FormDetalleComponent } from './form-detalle/form-detalle.component';
import { FormViewDetalleComponent } from './form-view-detalle/form-view-detalle.component';
import { FormViewDetalleRechazadoComponent } from './form-view-detalle-rechazado/form-view-detalle-rechazado.component';
import { FormDetalleEditComponent } from './form-detalle-edit/form-detalle-edit.component';

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
        path: 'edit/:id',
        component: FormDetalleEditComponent
    },
    {
        path: 'view-detalle/:id',
        component: FormViewDetalleComponent
    },
    {
        path: 'view-rechazado/:id',
        component: FormViewDetalleRechazadoComponent
    }
]as Routes;
