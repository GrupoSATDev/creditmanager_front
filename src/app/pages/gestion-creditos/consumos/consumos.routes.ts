import { Routes } from '@angular/router';
import { GridConsumosComponent } from './grid-consumos/grid-consumos.component';
import { FormConsumosComponent } from './form-consumos/form-consumos.component';

export default [
    {
        path: '',
        component: GridConsumosComponent
    },
    {
        path: 'detalle/:id',
        component: FormConsumosComponent
    }

] as Routes
