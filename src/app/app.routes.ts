import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { RoleGuard } from 'app/core/auth/guards/role.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import {
    AuthConfirmationRequiredComponent
} from './modules/auth/confirmation-required/confirmation-required.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'sign-in'},

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboard'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes')},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes')},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
        ]
    },
    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'dashboard', loadChildren: () => import('app/pages/dashboard/dashboard.routes')},
        ]
    },
    {
        path: 'pages',
        canActivate: [AuthGuard, RoleGuard],
        canActivateChild: [AuthGuard, RoleGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        data: {
            roles: ['Super Admin', 'Aliado'], // Solo accesible para roles específicos
            tipoUsuario: ['EmprasaMaestra', 'Empresa Aliada'],  // Solo para TipoUsuario específico
        },
        children: [
            {
                path: 'configuracion', loadChildren: () => import('app/pages/configuraciones/configuraciones.routes'),
                canActivate: [RoleGuard],
                data: {
                    roles: ['Super Admin']
                }
            },
            {
                path: 'gestion-creditos', loadChildren: () => import('app/pages/gestion-creditos/gestion-creditos.routes'),
                canActivate: [RoleGuard],
                data: {
                    roles: ['Super Admin', 'Analista', 'Aliado']
                }
            },
            {
                path: 'gestion-trabajadores', loadChildren: () => import('app/pages/gestion-empleados/gestion-empleados.routes'),
                canActivate: [RoleGuard],
                data: {
                    roles: ['Super Admin', 'Analista']
                }
            },
            {
                path: 'gestion-cobros', loadChildren: () => import('app/pages/gestion-cobros/gestion-cobros.routes'),
                canActivate: [RoleGuard],
                data: {
                    roles: ['Super Admin', 'Analista']
                }
            },
            {
                path: 'gestion-bancos', loadChildren: () => import('app/pages/gestion-bancos/gestion-bancos.routes'),
                canActivate: [RoleGuard],
                data: {
                    roles: ['Super Admin']
                }
            },
            {
                path: 'gestion-seguridad', loadChildren: () => import('app/pages/seguridad/seguridad.routes'),
                canActivate: [RoleGuard],
                data: {
                    roles: ['Super Admin']
                }
            },
            {
                path: 'reportes', loadChildren: () => import('app/pages/reportes/reportes.routes'),
                canActivate: [RoleGuard],
                data: {
                    roles: ['Super Admin', 'Analista', 'Cliente', 'Aliado', 'Trabajador', 'Auditor']
                }
            },
        ]
    },
    {
        path: 'not-authorized',
        component: AuthConfirmationRequiredComponent
    }
];
