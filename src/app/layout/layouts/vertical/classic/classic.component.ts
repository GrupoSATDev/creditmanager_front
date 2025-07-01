import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import {
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { map, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
    selector: 'classic-layout',
    templateUrl: './classic.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        FuseLoadingBarComponent,
        FuseVerticalNavigationComponent,
        MatButtonModule,
        MatIconModule,
        LanguagesComponent,
        FuseFullscreenComponent,
        SearchComponent,
        ShortcutsComponent,
        MessagesComponent,
        NotificationsComponent,
        UserComponent,
        RouterOutlet,
        QuickChatComponent,
    ],
})
export class ClassicLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    public navigation: any = { compact: [], default: [], futuristic: [], horizontal: [] }

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private roleVisibilityMap = {
        'Super Admin': ['2', '2.1', '2.2', '2.3', '2.4','2.5', '3', '3.1', '3.2', '3.3', '3.4', '4', '4.1', '5', '5.1', '5.2', '5.3', '5.4', '5.8','5.9', '6', '6.1', '6.2', '7', '7.1', '8', '8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8', '8.9', '9.0'],
        'Analista': ['2', '2.1', '2.4', '2.5', '3', '3.1', '3.2', '3.3', '4', '4.1', '5', '5.8', '8', '8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8', '8.9', '9.0' ],
        'Cliente': ['3', '3.3', '4', '4.1'],
        'Aliado': ['2', '2.4', '2.5', '8', '8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8', '8.9', '9.0'],
        'Desembolso': ['2', '2.3'],
        'aliado': ['2', '2.4', '2.5'],
        'Auditor': ['2', '2.1', '2.2', '2.3', '2.4', '2.5', '3', '3.1', '3.2', '3.3', '3.4', '4', '4.1', '5', '5.1', '5.2', '5.3', '5.4', '5.8','5.9', '6', '6.1', '6.2', '7', '7.1', '8', '8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8', '8.9', '9.0'],
        'Contador Cobro Credito Consumo': ['2', '2.5']
    };

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _authService: AuthService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to navigation data
        const userRole = this._authService.getRole();
        //const userTipo = this._authService.getTipoUsuario();
        this._navigationService.navigation$
            .pipe(
                takeUntil(this._unsubscribeAll),
            )
            .subscribe((navigation: Navigation) => {
                //console.log(userRole)
                //console.log(navigation)
                this.navigation = this.filterMenuByRole(navigation.default, this.roleVisibilityMap[userRole]);
                //console.log(navigation)
                //console.log(this.navigation)
                this.navigation = {
                    compact: [],
                    default: [...this.navigation],
                    futuristic: [],
                    horizontal: []
                }
            });


        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

    }

    filterMenuByRole(menu: any[], allowedIds: string[]): any[] {
        //console.log(menu)
        const filtro = menu.filter(item => {
            if (allowedIds.includes(item.id)) {
                if (item.children) {
                    item.children = this.filterMenuByRole(item.children, allowedIds);
                } return true;
            }
            return false;
        });
        //console.log(filtro);
        return filtro
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                name
            );

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
