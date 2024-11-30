import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';

export const RoleGuard: CanActivateFn = (route, state) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        const requiredRole  = route.data['roles'] || [];
        const requiredTipoUsuario  = route.data['tipoUsuario'] || [];

        console.log(requiredRole)
        console.log(requiredTipoUsuario)

        // Verifica roles desde el token
        // Verificar rol
        const userRole = authService.getRole();
        console.log(userRole)
        if (requiredRole.length && !requiredRole.includes(userRole)) {
            router.navigate(['/not-authorized']);
            return false;
        }

    // Verificar TipoUsuario
        const userTipo = authService.getTipoUsuario();
    console.log(userTipo)
        if (requiredTipoUsuario.length && !requiredTipoUsuario.includes(userTipo)) {
            router.navigate(['/not-authorized']);
            return false;
        }

        return true; // Tiene acceso
};
