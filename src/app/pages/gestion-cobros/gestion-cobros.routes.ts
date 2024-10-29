import { Routes } from '@angular/router';

export default [
    {
        path: '',
        children: [
            {
                path: 'cobros',
                loadChildren: () => import('./cobro-empleados/cobro-empleados.routes')
            },
            {
                path: 'aliados',
                loadChildren: () => import('./pago-aliados/pago-aliados.routes')
            },
            {
                path: 'trabajadores',
                loadChildren: () => import('./pago-trabajadores/pago-trabajadores.routes')
            },
            {
                path: 'trabajador',
                loadChildren: () => import('./pago-trabajador/pago-trabajador.routes')
            }
        ]
    }


] as Routes;
