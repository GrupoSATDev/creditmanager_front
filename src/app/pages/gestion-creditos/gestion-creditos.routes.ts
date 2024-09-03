import { Routes } from '@angular/router';

export default [
    {
        path: '',
        children: [
            {
                path: 'solicitudes',
                loadChildren: () => import('./solicitudes/solicitudes.routes')

            }
        ]
    }

] as Routes
