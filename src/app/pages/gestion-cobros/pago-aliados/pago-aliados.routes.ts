import { Routes } from '@angular/router';
import { GridAliadosComponent } from './grid-aliados/grid-aliados.component';
import { FormAliadosComponent } from './form-aliados/form-aliados.component';
import { FormViewAliadosComponent } from './form-view-aliados/form-view-aliados.component';

export default [
    {
        path: '',
        component: GridAliadosComponent
    },
    {
        path: 'aliado',
        component: FormAliadosComponent
    },
    {
        path: 'detalle/:id',
        component: FormViewAliadosComponent
    }
]as Routes;;
