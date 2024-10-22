import { Routes } from '@angular/router';
import { GridAliadosComponent } from './grid-aliados/grid-aliados.component';
import { FormAliadosComponent } from './form-aliados/form-aliados.component';

export default [
    {
        path: '',
        component: GridAliadosComponent
    },
    {
        path: 'aliado',
        component: FormAliadosComponent
    }
]as Routes;;
