import { Routes } from '@angular/router';

export default [
    {
        path: 'consumos',
        loadChildren: () => import('./reporte de consumos/reporteConsumos.routes')
    }

] as Routes
