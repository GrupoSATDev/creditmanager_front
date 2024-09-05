import { Routes } from '@angular/router';

export default [
    {
        path: '',
        children: [
            {
                path: 'solicitudes',
                loadChildren: () => import('./solicitudes/solicitudes.routes')
            },
            {
                path: 'tasas',
                loadChildren: () => import('./tasas-intereses/tasa-intereses.routes')
            },
            {
                path: 'tipos-pagos',
                loadChildren: () => import('./tipos-pagos/tipos-pagos.routes')
            }
        ]
    }

] as Routes
