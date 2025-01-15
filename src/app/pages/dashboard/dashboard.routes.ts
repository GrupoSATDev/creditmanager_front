import { Routes } from '@angular/router';
import { DashboardMainComponent } from './resumen-ejecutivo/dashboard-main/dashboard-main.component';

export default [
    {
        path: '',
        children: [
            {
                path: 'resumen-ejecutivo',
                loadChildren: () => import('./resumen-ejecutivo/resumen-ejecutivo.routes')
            }
        ]
    }

] as Routes
