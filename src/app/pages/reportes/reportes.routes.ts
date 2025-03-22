import { Routes } from '@angular/router';

export default [
    {
        path: 'consumos',
        loadChildren: () => import('./reporte de consumos/reporteConsumos.routes')
    },
    {
        path: 'desembolsos',
        loadChildren: () => import('./reporte-desembolsos/reporteDesembolsos.routes')
    },
    {
        path: 'cobros',
        loadChildren: () => import('./reporte-cobro-trabajadores/reporte-cobro-trabajadores.routes')
    },
    {
        path: 'solicitudes',
        loadChildren: () => import('./reporte-solicitudes/reporte-solicitudes.routes')
    },
    {
        path: 'deudas',
        loadChildren: () => import('./reporte-deudas/reporte-deudas.routes')
    },


] as Routes
