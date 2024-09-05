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
                id: 'apps.gestion.tasas',
                title: 'Tasas de interes',
                type: 'basic',
                link: '/pages/gestion-creditos/tasas',
            },
            {
                id: 'apps.gestion.tipos.pagos',
                title: 'Tipos de pagos',
                type: 'basic',
                link: '/pages/gestion-creditos/tipos-pagos',
            },

        ],
    },
    {
        id: 'apps.gestion-empleados',
        title: 'Gestión de empleados',
        type: 'collapsable',
        icon: 'heroicons_outline:user-group',
        children: [
            {
                id: 'apps.gestion.empleados',
                title: 'Empleados',
                type: 'basic',
                link: '/pages/gestion-empleados/empleados',
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
                title: 'Empresas clientes',
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
