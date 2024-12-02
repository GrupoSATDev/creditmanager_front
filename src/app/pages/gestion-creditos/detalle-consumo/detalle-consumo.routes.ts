import { Routes } from '@angular/router';
import { FormDetalleConsumoComponent } from './form-detalle-consumo/form-detalle-consumo.component';

export default [
    {
        path: '',
        component: FormDetalleConsumoComponent
    },
    {
        path: ':tipo/:num',
        component: FormDetalleConsumoComponent
    }

] as Routes
