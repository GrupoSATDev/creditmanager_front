import { Routes } from '@angular/router';

export default [
    {
        path: 'gestion-empleados',
        loadChildren: () => import('./empleados/empleados.routes')
    }
] as Routes
