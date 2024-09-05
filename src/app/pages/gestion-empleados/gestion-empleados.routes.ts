import { Routes } from '@angular/router';

export default [
    {
      path: '',
      children: [
        {
            path: 'empleados',
            loadChildren: () => import('./empleados/empleados.routes')
        }
      ]
    },
] as Routes
