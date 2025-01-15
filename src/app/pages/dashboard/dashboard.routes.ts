import { Routes } from '@angular/router';
import { DashboardMainComponent } from './resumen-ejecutivo/dashboard-main/dashboard-main.component';

export default [
    {
        path: '',
        children: [
            {
                path: 'resumen-ejecutivo',
                loadChildren: () => import('./resumen-ejecutivo/resumen-ejecutivo.routes')
            },
            {
                path: 'rentabilidad',
                loadChildren: () => import('./dashboard-rentabilidad-intereses/rentabilidad-intereses.routes')
            },
            {
                path: 'cartera',
                loadChildren: () => import('./dashboard-cartera-morosidad/cartera-morosidad.routes')
            },
            {
                path: 'financieras',
                loadChildren: () => import('./dashboard-comparativas-financieras/comparativas-financieras.routes')
            },
        ]
    }

] as Routes
