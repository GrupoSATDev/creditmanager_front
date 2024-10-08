import { Routes } from '@angular/router';

export default [
    {
      path: '',
      children: [
        {
            path: 'trabajadores',
            loadChildren: () => import('./empleados/empleados.routes')
        }
      ]
    },
] as Routes
