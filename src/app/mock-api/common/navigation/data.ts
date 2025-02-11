/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : '1',
        title: 'Dashboard',
        type : 'collapsable',
        icon : 'heroicons_outline:chart-pie',
        children: [
            {
                id: '1.1',
                title: 'Resumen ejecutivo',
                type: 'basic',
                link: '/pages/dashboard/resumen-ejecutivo',
            },
            {
                id: '1.2',
                title: 'Rentabilidad e intereses',
                type: 'basic',
                link: '/pages/dashboard/rentabilidad',
            },
            {
                id: '1.3',
                title: 'Cartera y morosidad',
                type: 'basic',
                link: '/pages/dashboard/cartera',
            },
            /*{
                id: '1.4',
                title: 'Comparativas financieras',
                type: 'basic',
                link: '/pages/dashboard/financieras',
            },*/
        ],
    },
    {
        id: '2',
        title: 'Gestión de créditos',
        type: 'collapsable',
        icon: 'attach_money',
        children: [
            {
                id: '2.1',
                title: 'Solicitudes',
                type: 'basic',
                link: '/pages/gestion-creditos/solicitudes',
            },
            {
                id: '2.2',
                title: 'Créditos',
                type: 'basic',
                link: '/pages/gestion-creditos/creditos',
            },
            {
                id: '2.3',
                title: 'Desembolsos',
                type: 'basic',
                link: '/pages/gestion-creditos/desembolsos',
            },
            {
                id: '2.4',
                title: 'Detalle consumo',
                type: 'basic',
                link: '/pages/gestion-creditos/consumos',
            },
        ],
    },
    {
        id: '3',
        title: 'Gestión de cartera',
        type: 'collapsable',
        icon: 'request_quote',
        children: [
            {
                id: '3.1',
                title: 'Historico - Trabajadores',
                type: 'basic',
                link: '/pages/gestion-cobros/cobros',
            },
            {
                id: '3.2',
                title: 'Pago proveedores',
                type: 'basic',
                link: '/pages/gestion-cobros/aliados',
            },
            {
                id: '3.3',
                title: 'Cobro trabajadores',
                type: 'basic',
                link: '/pages/gestion-cobros/maestro',
            },
            {
                id: '3.4',
                title: 'Subscripción',
                type: 'basic',
                link: '/pages/gestion-cobros/cobro-aliado',
            },
            /*{
                id: 'apps.gestion.subcripciones',
                title: 'Subscripciones',
                type: 'basic',
                link: '/pages/gestion-cobros/subscripciones',
            }*/
        ],
    },
    {
        id: '4',
        title: 'Gestión de trabajadores',
        type: 'collapsable',
        icon: 'heroicons_outline:user-group',
        children: [
            {
                id: '4.1',
                title: 'Trabajadores',
                type: 'basic',
                link: '/pages/gestion-trabajadores/trabajadores',
            },
        ],
    },
   {
        id: '5',
        title: 'Configuraciones',
        type: 'collapsable',
        icon: 'settings',
        children: [
            {
                id: '5.1',
                title: 'Empresas maestras',
                type: 'basic',
                link: '/pages/configuracion/empresas-maestras',
            },
            {
                id: '5.2',
                title: 'Clientes - Aliados',
                type: 'basic',
                link: '/pages/configuracion/empresas-clientes',
            },
            {
                id: '5.3',
                title: 'Tipos de documentos',
                type: 'basic',
                link: '/pages/configuracion/tipos-documentos',
            },
            {
                id: '5.4',
                title: 'Capital de inversión',
                type: 'basic',
                link: '/pages/configuracion/capital-inversion',
            },
            {
                id: '5.5',
                title: 'Departamentos',
                type: 'basic',
                link: '/pages/configuracion/departamentos',
            },
            {
                id: '5.6',
                title: 'Géneros',
                type: 'basic',
                link: '/pages/configuracion/generos',
            },
            {
                id: '5.7',
                title: 'Tipos de pagos',
                type: 'basic',
                link: '/pages/configuracion/tipos-pagos',
            },
            {
                id: '5.8',
                title: 'Tasas de interes',
                type: 'basic',
                link: '/pages/configuracion/tasas',
            },
            {
                id: '5.9',
                title: 'Cobros fijos',
                type: 'basic',
                link: '/pages/configuracion/cobros-fijos',
            },

        ],
    },
    {
        id: '6',
        title: 'Gestión bancos',
        type: 'collapsable',
        icon: 'account_balance',
        children: [
            {
                id: '6.1',
                title: 'Cuentas bancarias',
                type: 'basic',
                link: '/pages/gestion-bancos/cuentas',
            },
            {
                id: '6.2',
                title: 'Bancos',
                type: 'basic',
                link: '/pages/gestion-bancos/bancos',
            },
        ],
    },
    {
        id: '7',
        title: 'Seguridad',
        type: 'collapsable',
        icon: 'lock',
        children: [
            {
                id: '7.1',
                title: 'Usuarios',
                type: 'basic',
                link: '/pages/gestion-seguridad/empresas',
            },
        ],
    },
    {
        id: '8',
        title: 'Reportes',
        type: 'collapsable',
        icon: 'heroicons_solid:document',
        children: [
            {
                id: '8.1',
                title: 'Reporte de consumos',
                type: 'basic',
                link: '/pages/reportes/consumos',
            },
            {
                id: '8.2',
                title: 'Reporte de desembolsos',
                type: 'basic',
                link: '/pages/reportes/desembolsos',
            },
        ],
    },

];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
];
