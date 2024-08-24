import { Routes } from '@angular/router';

export default [
    {
        path: '',
        children: [
            {
                path: 'empresas-maestras',
                loadChildren: () => import('./empresas-maestras/empresas-maestras.routes')
            },
            {
                path: 'empresas-clientes',
                loadChildren: () => import('./empresas-clientes/empresas-clientes.routes')
            }
        ]
    }
] as Routes;
