/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'apps.gestion-creditos',
        title: 'Gestión de créditos',
        type: 'collapsable',
        icon: 'attach_money',
        children: [
            {
                id: 'apps.gestion.solicitudes',
                title: 'Solicitudes',
                type: 'basic',
                link: '/pages/gestion-creditos/solicitudes',
            },
            {
                id: 'apps.gestion.creditos',
                title: 'Créditos',
                type: 'basic',
                link: '/pages/gestion-creditos/creditos',
            },
            {
                id: 'apps.gestion.detalle.consumo',
                title: 'Consumo',
                type: 'basic',
                link: '/pages/gestion-creditos/detalle-consumo',
            },
            {
                id: 'apps.gestion.detalle.dembolso',
                title: 'Desembolsos',
                type: 'basic',
                link: '/pages/gestion-creditos/desembolsos',
            },
            {
                id: 'apps.gestion.detalles.consumos',
                title: 'Detalle consumo',
                type: 'basic',
                link: '/pages/gestion-creditos/consumos',
            },
        ],
    },
    {
        id: 'apps.gestion-cobros',
        title: 'Gestión de cartera',
        type: 'collapsable',
        icon: 'request_quote',
        children: [
            {
                id: 'apps.gestion.cobros',
                title: 'Cobro trabajadores',
                type: 'basic',
                link: '/pages/gestion-cobros/cobros',
            },
            {
                id: 'apps.gestion.aliados',
                title: 'Pago proveedores',
                type: 'basic',
                link: '/pages/gestion-cobros/aliados',
            },
            {
                id: 'apps.gestion.maestro',
                title: 'Pago trabajadores',
                type: 'basic',
                link: '/pages/gestion-cobros/maestro',
            }
           /* {
                id: 'apps.gestion.trabajador',
                title: 'Pago trabajadores',
                type: 'basic',
                link: '/pages/gestion-cobros/trabajadores',
            },
            {
                id: 'apps.gestion.trabajador.individual',
                title: 'Pago trabajador',
                type: 'basic',
                link: '/pages/gestion-cobros/trabajador',
            },*/
        ],
    },
    {
        id: 'apps.gestion-empleados',
        title: 'Gestión de trabajadores',
        type: 'collapsable',
        icon: 'heroicons_outline:user-group',
        children: [
            {
                id: 'apps.gestion.empleados',
                title: 'Trabajadores',
                type: 'basic',
                link: '/pages/gestion-trabajadores/trabajadores',
            },
        ],
    },
   {
        id: 'apps.configuraciones',
        title: 'Configuraciones',
        type: 'collapsable',
        icon: 'settings',
        children: [
            {
                id: 'apps.empresas.maestras',
                title: 'Empresas maestras',
                type: 'basic',
                link: '/pages/configuracion/empresas-maestras',
            },
            {
                id: 'apps.empresas.clientes',
                title: 'Clientes - Aliados',
                type: 'basic',
                link: '/pages/configuracion/empresas-clientes',
            },
            {
                id: 'apps.tipos.documentos',
                title: 'Tipos de documentos',
                type: 'basic',
                link: '/pages/configuracion/tipos-documentos',
            },
            {
                id: 'apps.capital.inversion',
                title: 'Capital de inversión',
                type: 'basic',
                link: '/pages/configuracion/capital-inversion',
            },
            {
                id: 'apps.departamentos',
                title: 'Departamentos',
                type: 'basic',
                link: '/pages/configuracion/departamentos',
            },
            {
                id: 'apps.generos',
                title: 'Géneros',
                type: 'basic',
                link: '/pages/configuracion/generos',
            },
            {
                id: 'apps.gestion.tipos.pagos',
                title: 'Tipos de pagos',
                type: 'basic',
                link: '/pages/configuracion/tipos-pagos',
            },
            {
                id: 'apps.gestion.tasas',
                title: 'Tasas de interes',
                type: 'basic',
                link: '/pages/configuracion/tasas',
            },

        ],
    },
    {
        id: 'apps.cuentas',
        title: 'Gestión bancos',
        type: 'collapsable',
        icon: 'account_balance',
        children: [
            {
                id: 'apps.cuentas.bancarias',
                title: 'Cuentas bancarias',
                type: 'basic',
                link: '/pages/gestion-bancos/cuentas',
            },
            {
                id: 'apps.cuentas.bancarias',
                title: 'Bancos',
                type: 'basic',
                link: '/pages/gestion-bancos/bancos',
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
