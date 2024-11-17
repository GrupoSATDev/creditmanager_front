import { Routes } from '@angular/router';

export default [
    {
        path: '',
        children: [
            {
                path: 'empresas',
                loadChildren: () => import('./usuarios-empresas/usuarios-empresas.routes')
            }
        ]
    }

]as Routes;
