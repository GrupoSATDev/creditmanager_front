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
    {
        path: 'desembolsos-general',
        loadChildren: () => import('./reporte-desembolsos-general/reportes-desembolsos-general.routes')
    },
    {
        path: 'ganancias',
        loadChildren: () =>import('./reporte-ganancias-empresa/reporte-ganancias-empresa.routes')
    },
    {
        path: 'deudas-empresa',
        loadChildren: () => import('./reporte-deudas-empresa/reporte-deudas-empresas.routes')
    },
    {
        path: 'historico',
        loadChildren: () => import('./reporte-prestamo-historico/reporte-prestamo-historico.routes')
    },
    {
        path: 'recupera-inversion',
        loadChildren: () => import('./reporte-recupera-inversion/recupera-inversion.routes')
    },
    {
        path: 'consumo-deudores',
        loadChildren: () => import('./reporte-consumo-deudores/consumo-deudores.routes')
    },


] as Routes
