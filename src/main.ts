import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'app/app.component';
import { appConfig } from 'app/app.config';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/ngsw-worker.js').then((registration) => {
            console.log('Service Worker registrado con éxito:', registration);
        }).catch((error) => {
            console.error('Error en el registro del Service Worker:', error);
        });
    });
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err)
);
