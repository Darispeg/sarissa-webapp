/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        link: 'dashboard',
        icon: 'heroicons_outline:chart-square-bar'
    },
    {
        id   : 'admin',
        title: 'Administracion',
        subtitle : 'Administracion del sistema',
        type : 'group',
        icon : 'heroicons_outline:cog',
        children: [{
            id: 'users',
            title : 'Usuarios',
            type: 'basic',
            icon: 'heroicons_outline:user',
            link: 'admin/users'
        },
        ]
    },
    {
        id: 'projects',
        title: 'Proyectos',
        type: 'basic',
        link: 'projects',
        icon: 'heroicons_outline:rectangle-stack'
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        link: 'dashboard',
        icon: 'heroicons_outline:chart-square-bar'
    },
    {
        id   : 'admin',
        title: 'Administracion',
        subtitle : 'Administracion del sistema',
        type : 'group',
        icon : 'heroicons_outline:cog',
        children: []
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        link: 'dashboard',
        icon: 'heroicons_outline:chart-square-bar'
    },
    {
        id   : 'admin',
        title: 'Administracion',
        subtitle : 'Administracion del sistema',
        type : 'group',
        icon : 'heroicons_outline:cog',
        children: []
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        link: 'dashboard',
        icon: 'heroicons_outline:chart-square-bar'
    },
    {
        id   : 'admin',
        title: 'Administracion',
        subtitle : 'Administracion del sistema',
        type : 'group',
        icon : 'heroicons_outline:cog',
        children: []
    },
    {
        id: 'projects',
        title: 'Proyectos',
        type: 'basic',
        link: 'projects',
        icon: 'heroicons_outline:clipboard-list'
    },
];
