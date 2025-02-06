import { Routes } from '@angular/router';

export default [
    {
        path: 'consumos',
        loadChildren: () => import('./reporte de consumos/reporteConsumos.routes')
    },
    {
        path: 'desembolsos',
        loadChildren: () => import('./reporte-desembolsos/reporteDesembolsos.routes')
    },

] as Routes
