import { Routes } from '@angular/router';

export default [

    {
        path: '',
        children: [
            {
                path: 'cuentas',
                loadChildren: () => import('./cuentas-bancarias/cuentas.routes')
            }
        ]
    }

] as Routes;
