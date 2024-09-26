import { Routes } from '@angular/router';

export default [
    {
        path: '',
        children: [
            {
                path: 'cobros',
                loadChildren: () => import('./cobro-empleados/cobro-empleados.routes')
            }
        ]
    }


] as Routes;
