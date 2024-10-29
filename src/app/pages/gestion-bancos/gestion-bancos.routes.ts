import { Routes } from '@angular/router';

export default [

    {
        path: '',
        children: [
            {
                path: 'cuentas',
                loadChildren: () => import('./cuentas-bancarias/cuentas.routes')
            },
            {
                path: 'bancos',
                loadChildren: () => import('./bancos/bancos.routes')
            }
        ]
    }

] as Routes;
