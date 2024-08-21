import { Routes } from '@angular/router';

export default [
    {
        path: '',
        children: [
            {
                path: 'empresas-maestras',
                loadChildren: () => import('./empresas-maestras/empresas-maestras.routes')
            }
        ]
    }
] as Routes;
