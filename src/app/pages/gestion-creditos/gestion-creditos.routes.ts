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
                path: 'creditos',
                loadChildren: () => import('./creditos/creditos.routes')
            },
            {
                path: 'detalle-consumo',
                loadChildren: () => import('./detalle-consumo/detalle-consumo.routes')
            },
            {
                path: 'consumos',
                loadChildren: () => import('./consumos/consumos.routes')
            },
            {
                path: 'desembolsos',
                loadChildren: () => import('./desembolsos/desembolsos.routes')
            },

        ]
    }

] as Routes
