import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideServiceWorker } from '@angular/service-worker';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                provideServiceWorker('ngsw-worker.js', {
                    enabled: true
                })
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // tus pruebas aquí
});
