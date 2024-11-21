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

    it('should do something', async () => {
        // Correcto
        await fixture.whenStable().then().then(() => {
            // Código que se ejecutará cuando el DOM esté estable
        });
        // Tu código aquí
    });
});
