import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import {
    BehaviorSubject,
    catchError,
    interval,
    map,
    Observable,
    of,
    switchMap,
    takeUntil,
    tap,
    throwError,
} from 'rxjs';
import { AppSettingsService } from '../app-config/app-settings-service';
import { user } from '../../mock-api/common/user/data';
import { jwtDecode } from 'jwt-decode';
import { AesEncryptionService } from '../services/aes-encryption.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { TokenrenewaldialogComponent } from '../../pages/shared/tokenrenewaldialog/tokenrenewaldialog.component';
import { Router } from '@angular/router';

export type UserRole = 'Aliado' | 'Analista' | 'Super Admin' | 'Auditor' | 'Trabajador' | 'Cliente';
export type UserType = 'Empresa Aliada' | 'Trabajador' | 'EmprasaMaestra' | 'Cliente-Aliado' | 'Empresa Cliente';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private _appSettings = inject(AppSettingsService);
    private aesEncriptService = inject(AesEncryptionService);
    private readonly destroyedRef = inject(DestroyRef);
    private matDialog = inject(MatDialog);
    private router = inject(Router);

    private _tokenExpirationSubject = new BehaviorSubject<boolean>(false); // Para notificar que el token está por expirar

    constructor() {
        this.restoreSession();
        this.checkTokenExpiration();
    }

    private restoreSession(): void {
        if (!this.accessToken || !this.accessRefreshToken) {
            this.signOut();
            return;
        }

        // Verifica si el token está expirado
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            console.log("Token expirado, intentando renovar...");
            this.signInUsingToken().subscribe((isAuthenticated) => {
                if (!isAuthenticated) {
                    console.log("No se pudo renovar el token, cerrando sesión...");
                    this.signOut();
                } else {
                    console.log("Token renovado exitosamente.");
                    this._authenticated = true;
                }
            });
        } else {
            console.log("Token válido, restaurando sesión...");
            this._authenticated = true;
        }
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    set refreshToken(token: string) {
        localStorage.setItem('refreshToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    get accessRefreshToken(): string {
        return localStorage.getItem('refreshToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { correo: string; contrasena: string }): Observable<any> {
        const form = {
            correo: credentials.correo,
            contrasena: credentials.contrasena
        }

        const encryptForm = {
            login: this.aesEncriptService.encryptObject(form)
        }
        // Throw error, if the user is already logged in
        //TODO esto ocasiona error
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        //return this._httpClient.post('api/auth/sign-in', credentials).pipe(
        return this._httpClient.post(this._appSettings.auth.url.base, encryptForm).pipe(
            map((response: any) => {
                const dataUser = {
                    id: Math.random().toString(),
                    name: response.data.nombre,
                    email: response.data.correo,
                    avatar: 'images/avatars/avatar-user.png',
                    status: 'online'
                }
                response.tokenType = 'bearer',
                response.user = {
                    ...dataUser
                }
                delete response.data;
               /* {
                    "user": {
                        "name": "Brian Hughes",
                        "email": "hughes.brian@company.com",
                        "avatar": "images/avatars/brian-hughes.jpg",
                        "status": "online"
                    },
                    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Mjc0MTAzODMsImlzcyI6IkZ1c2UiLCJleHAiOjE3MjgwMTUxODN9.NbafzoPOj3wrDaEBxDUvqcn47KN6CNyu3kpCm88rw7M",
                    "tokenType": "bearer"
                }*/
                return response;

            }),
            switchMap((response: any) => {
                // Store the access token in the local storage
                //this.accessToken = response.token;
                this.accessToken = response.accessToken;
                this.refreshToken = response.refreshToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service

                //this._userService.user = dataUser;
                this._userService.user = response.user;
                //this._userService.user = user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<boolean> {
        const token = this.accessToken;
        const refreshToken = this.accessRefreshToken;

        if (!token || !refreshToken) {
            this.signOut();
            return of(false);
        }

        console.log("Verificando token con API...");

        return this._httpClient.post(this._appSettings.auth.url.baseRefresh, { token, refreshToken }).pipe(
            catchError((error) => {
                this.signOut();
                return of(false);
            }),
            switchMap((response: any) => {
                if (response.token) {
                    this.accessToken = response.token;
                    this.refreshToken = response.refreshToken;
                    this._authenticated = true;
                    return of(true);
                }
                this.signOut();
                return of(false);
            })
        );
    }


    public checkTokenExpiration(): void {
        let userInactive = true; // Estado de inactividad del usuario
        const inactivityThreshold = 300000; // 5 minutos de inactividad (ajusta según necesites)
        const tokenExpirationThreshold = 60000; // 1 minuto antes de vencer (para renovación automática)

        // Función para marcar al usuario como activo
        const markUserAsActive = () => {
            userInactive = false; // El usuario está activo
            setTimeout(() => {
                userInactive = true; // Vuelve a inactivo después del umbral
            }, inactivityThreshold);
        };

        // Detectar actividad del usuario
        const activityEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
        activityEvents.forEach(event => {
            window.addEventListener(event, markUserAsActive);
        });

        // Detectar si el usuario cambia de pestaña o minimiza el navegador
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                userInactive = true; // El usuario está inactivo (minimizó el navegador o cambió de pestaña)
            } else {
                markUserAsActive(); // El usuario volvió a la aplicación
            }
        });

        // Detectar si el usuario cambia a otra aplicación
        window.addEventListener('blur', () => {
            userInactive = true; // El usuario está inactivo (cambió a otra aplicación)
        });
        window.addEventListener('focus', markUserAsActive); // El usuario volvió a la aplicación

        interval(10000) // Revisa cada 10 segundos
            .pipe(
                tap(() => {
                    const token = this.accessToken; // Se obtiene desde localStorage
                    const refreshToken = this.accessRefreshToken; // Se obtiene desde localStorage

                    if (!token || !refreshToken) {
                        this.signOut(); // Si no hay token o refreshToken, cerrar sesión
                        return;
                    }

                    const expiresIn = AuthUtils.getTokenExpirationTime(token);
                    const timeLeft = expiresIn - Date.now();

                    if (timeLeft > 0 && timeLeft <= tokenExpirationThreshold) {
                        // Token está a punto de vencer (1 minuto antes)
                        if (!userInactive) {
                            // Usuario activo: renovar token automáticamente
                            this.signInUsingToken().subscribe({
                                next: (success) => {
                                    if (success) {
                                        console.log('Token renovado automáticamente');
                                    } else {
                                        console.error('Error renovando el token');
                                        this.signOut(); // Cerrar sesión si falla la renovación
                                    }
                                },
                                error: (err) => {
                                    console.error('Error renovando el token:', err);
                                    this.signOut(); // Cerrar sesión si hay un error
                                },
                            });
                        }
                    } else if (timeLeft <= 0) {
                        // Token ya expiró
                        if (userInactive) {
                            // Usuario inactivo: cerrar sesión automáticamente
                            this.signOut();
                        } else {
                            // Usuario activo pero el token expiró: cerrar sesión
                            this.signOut();
                        }
                    }
                })
            ).subscribe();
    }

    public openTokenRenewalDialog(): void {
        const dialogRef = this.matDialog.open(TokenrenewaldialogComponent, {
            width: '400px',
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((renew: boolean) => {
            if (renew) {
                this.signInUsingToken().subscribe();
            } else {
                this.signOut();
                this.router.navigate(['/sign-in']);
            }
        });
    }


    logoutSession(): Observable<any> {
        return this._httpClient.post(this._appSettings.auth.url.baseOut, {});
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        console.log("Cerrando sesión...");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        this._authenticated = false;
        this._userService.user = null; // Limpiar usuario
        this.router.navigate(['/sign-in']);

        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
           return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
        //return of(true);

    }

    private decodeToken(): any {
        if (!this.accessToken) return null;
        try {
            return jwtDecode(this.accessToken);
        } catch (error) {
            console.error('Error al decodificar el token', error);
            return null;
        }
    }

    // Obtiene el rol desde el token
    getRole(): string | null {
        const decoded = this.decodeToken();
        return decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
    }

    // Obtiene el TipoUsuario desde el token
    getTipoUsuario(): string | null {
        const decoded = this.decodeToken();
        return decoded?.TipoUsuario || null;
    }

    // Valida si tiene un rol específico
    hasRole(role: string): boolean {
        return this.getRole() === role;
    }


    // Valida si es un TipoUsuario específico
    hasTipoUsuario(tipoUsuario: string): boolean {
        return this.getTipoUsuario() === tipoUsuario;
    }
}
