import { Routes } from '@angular/router';
import { GridConsumosComponent } from './grid-consumos/grid-consumos.component';
import { FormConsumosComponent } from './form-consumos/form-consumos.component';
import { MainDetalleConsumoComponent } from './main-detalle-consumo/main-detalle-consumo.component';

export default [
    {
        path: '',
        component: MainDetalleConsumoComponent
    },
    {
        path: 'listar',
        component: GridConsumosComponent
    },
    {
        path: 'detalle/:id',
        component: FormConsumosComponent
    }

] as Routes
