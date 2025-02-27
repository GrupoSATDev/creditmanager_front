import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { Observable, catchError, throwError, switchMap } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Clone the request object
    let newReq = req.clone();

    // Add Authorization header if the token is valid
    if (authService.accessToken && !AuthUtils.isTokenExpired(authService.accessToken)) {
        newReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + authService.accessToken),
        });
    }

    // Handle the response
    return next(newReq).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                // If the error is 401 Unauthorized, try to refresh the token
                return authService.signInUsingToken().pipe(
                    switchMap((isAuthenticated) => {
                        if (isAuthenticated) {
                            // If the token was refreshed, retry the original request
                            newReq = req.clone({
                                headers: req.headers.set('Authorization', 'Bearer ' + authService.accessToken),
                            });
                            return next(newReq);
                        } else {
                            // If the token refresh failed, sign out and redirect to login
                            authService.signOut();
                            router.navigate(['/sign-in']);
                            return throwError(error);
                        }
                    }),
                    catchError((refreshError) => {
                        // If there was an error refreshing the token, sign out and redirect to login
                        authService.signOut();
                        router.navigate(['/sign-in']);
                        return throwError(refreshError);
                    })
                );
            } else {
                // If the error is not 401, just throw it
                return throwError(error);
            }
        })
    );
};
