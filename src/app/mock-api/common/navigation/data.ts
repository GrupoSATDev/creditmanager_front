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
