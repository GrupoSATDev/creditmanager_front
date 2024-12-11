import { Routes } from '@angular/router';
import { GridCobroAliadosComponent } from './grid-cobro-aliados/grid-cobro-aliados.component';
import { CobroAliadoFacturaComponent } from './cobro-aliado-factura/cobro-aliado-factura.component';

export default [
    {
        path: '',
        component: GridCobroAliadosComponent
    },
    {
        path: 'factura/:id',
        component: CobroAliadoFacturaComponent
    }
] as Routes
