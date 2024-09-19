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
            },
            {
                path: 'creditos',
                loadChildren: () => import('./creditos/creditos.routes')
            },
            {
                path: 'detalle-consumo',
                loadChildren: () => import('./detalle-consumo/detalle-consumo.routes')
            }
        ]
    }

] as Routes
