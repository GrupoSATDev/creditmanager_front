import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, map, Observable, of, switchMap, takeUntil, throwError } from 'rxjs';
import { AppSettingsService } from '../app-config/app-settings-service';
import { user } from '../../mock-api/common/user/data';
import { jwtDecode } from 'jwt-decode';
import { AesEncryptionService } from '../services/aes-encryption.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
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
       /* if (this._authenticated) {
            return throwError('User is already logged in.');
        }*/

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
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient
            .post('api/auth/sign-in-with-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {
                    // Replace the access token with the new one if it's available on
                    // the response object.
                    //
                    // This is an added optional step for better security. Once you sign
                    // in using the token, you should generate a new one on the server
                    // side and attach it to the response object. Then the following
                    // piece of code can replace the token with the refreshed one.
                    if (response.accessToken) {
                        this.accessToken = response.accessToken;
                    }

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return true
                    return of(true);
                })
            );
    }

    logoutSession(): Observable<any> {
        return this._httpClient.post(this._appSettings.auth.url.baseOut, {});
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;
                // Return the observable
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
        //return this.signInUsingToken();
        return of(true);

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
