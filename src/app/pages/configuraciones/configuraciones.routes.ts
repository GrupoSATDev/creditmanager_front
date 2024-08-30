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
            },
            {
                path: 'tipos-documentos',
                loadChildren: () => import('./tipos-documentos/tipos-documentos.routes')
            },
            {
                path: 'capital-inversion',
                loadChildren: () => import('./capital-inversion/capital-inversion.routes')
            },
            {
                path: 'departamentos',
                loadChildren: () => import('./departamentos/departamentos.routes')
            }
        ]
    }
] as Routes;
