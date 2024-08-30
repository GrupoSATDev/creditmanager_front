/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
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
