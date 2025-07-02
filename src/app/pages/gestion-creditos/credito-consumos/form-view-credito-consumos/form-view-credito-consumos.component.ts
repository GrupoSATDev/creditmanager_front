import { Component, inject, OnInit } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FuseCardComponent } from '../../../../../@fuse/components/card';
import { MatAnchor, MatButton } from '@angular/material/button';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CreditosService } from '../../../../core/services/creditos.service';
import { DetalleConsumoService } from '../../../../core/services/detalle-consumo.service';
import { map, Subscription } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AesEncryptionService } from '../../../../core/services/aes-encryption.service';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { EstadosCreditos } from '../../../../core/enums/estados-creditos';
import { CodigosDetalleConsumo } from '../../../../core/enums/detalle-consumo';
import { CreditoConsumosService } from '../../../../core/services/credito-consumos.service';
import { DialogCreditoConsumosComponent } from '../dialog-credito-consumos/dialog-credito-consumos.component';
import { DialogBloqueoComponent } from '../../creditos/dialog-bloqueo/dialog-bloqueo.component';
import {
    DialogBloqueosCreditosConsumoComponent
} from '../dialog-bloqueos-creditos-consumo/dialog-bloqueos-creditos-consumo.component';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
    selector: 'app-form-view-credito-consumos',
    standalone: true,
    imports: [
        CdkScrollable,
        CurrencyPipe,
        DatePipe,
        FuseCardComponent,
        MatAnchor,
        RouterLink,
        MatIcon,
        MatButton,
        NgIf,
        NgForOf,
        NgClass,
    ],
    templateUrl: './form-view-credito-consumos.component.html',
    styleUrl: './form-view-credito-consumos.component.scss',
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
        CurrencyPipe,
        DecimalPipe,
    ],
})
export class FormViewCreditoConsumosComponent implements OnInit {
    public toasService = inject(ToastAlertsService);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    private activatedRoute = inject(ActivatedRoute);
    public _authService: AuthService = inject(AuthService);

    private creditoConsumoService: CreditoConsumosService = inject(
        CreditoConsumosService
    );
    private detalleConsumoService: DetalleConsumoService = inject(
        DetalleConsumoService
    );
    private currencyPipe = inject(CurrencyPipe);
    private datePipe = inject(DatePipe);
    private router = inject(Router);
    public subcription$: Subscription;
    public items: any;
    tasas = [];
    idCredito: string = '';
    public _matDialog = inject(MatDialog);
    public aesEncriptService = inject(AesEncryptionService);

    ngOnInit(): void {
        this.idCredito = this.activatedRoute.snapshot.paramMap.get('id');
        this.getCredito(this.idCredito);
    }

    onConsumo() {
        this._matDialog.open(DialogCreditoConsumosComponent, {
            data: {
                data: this.items,
            },
            width: '30%',
            disableClose: true,
        });
    }

    onBloqueo() {
        this._matDialog.open(DialogBloqueosCreditosConsumoComponent, {
            data: {
                data: this.items,
            },
            width: '30%',
            disableClose: true,
        });
    }

    onDesbloqueo() {
        this._matDialog.open(DialogBloqueosCreditosConsumoComponent, {
            data: {
                data: this.items,
            },
            width: '30%',
            disableClose: true,
        });
    }

    getCredito(id) {
        this.subcription$ = this.creditoConsumoService
            .getCreditoConsumo(id)
            .pipe(
                map((response) => {
                    response.fechaCreacion = this.datePipe.transform(
                        response.fechaCreacion,
                        'dd/MM/yyyy'
                    );

                    if (response.cupoAprobado) {
                        response.cupoAprobado = this.aesEncriptService.decrypt(
                            response.cupoAprobado
                        );
                    }
                    if (response.cupoConsumido) {
                        response.cupoConsumido = this.aesEncriptService.decrypt(
                            response.cupoConsumido
                        );
                    }
                    if (response.cupoDisponible) {
                        response.cupoDisponible =
                            this.aesEncriptService.decrypt(
                                response.cupoDisponible
                            );
                    }

                    response.cupoAprobado = this.currencyPipe.transform(
                        response.cupoAprobado,
                        'USD',
                        'symbol',
                        '1.2-2'
                    );
                    response.cupoConsumido = this.currencyPipe.transform(
                        response.cupoConsumido,
                        'USD',
                        'symbol',
                        '1.2-2'
                    );
                    response.cupoDisponible = this.currencyPipe.transform(
                        response.cupoDisponible,
                        'USD',
                        'symbol',
                        '1.2-2'
                    );

                    return response;
                })
            )
            .subscribe((response) => {
                this.items = response.data;
            });
    }
    protected readonly CodigosDetalleConsumo = CodigosDetalleConsumo;
}
