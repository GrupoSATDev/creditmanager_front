import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatOption, MatSelect } from '@angular/material/select';
import { ToastAlertsService } from '../../../../core/services/toast-alerts.service';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CreditosService } from '../../../../core/services/creditos.service';
import { TiposPagosService } from '../../../../core/services/tipos-pagos.service';
import { CapitalInversionService } from '../../../../core/services/capital-inversion.service';
import { EstadoCreditosService } from '../../../../core/services/estado-creditos.service';
import { TasasInteresService } from '../../../../core/services/tasas-interes.service';
import { Subscription } from 'rxjs';
import { DateAdapterService } from '../../../../core/services/date-adapter.service';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { FuseCardComponent } from '../../../../../@fuse/components/card';
import { CodigosDetalleConsumo } from '../../../../core/enums/detalle-consumo';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmDesembolsoComponent } from '../dialog-confirm-desembolso/dialog-confirm-desembolso.component';

@Component({
  selector: 'app-form-view-detalle',
  standalone: true,
    imports: [
        CdkScrollable,
        CurrencyPipe,
        DatePipe,
        FormsModule,
        MatAnchor,
        MatButton,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        MatSuffix,
        NgForOf,
        NgIf,
        RouterLink,
        CustomTableComponent,
        FuseCardComponent,
        NgClass,
    ],
    providers: [
        { provide: DateAdapter, useClass: DateAdapterService },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe
    ],
  templateUrl: './form-view-detalle.component.html',
  styleUrl: './form-view-detalle.component.scss'
})
export class FormViewDetalleComponent implements OnInit, OnDestroy{
    public toasService = inject(ToastAlertsService);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);
    private activatedRoute = inject(ActivatedRoute);
    private creditoService: CreditosService = inject(CreditosService);
    private router = inject(Router);
    public subcription$: Subscription;
    public items: any;
    public detalleEmpleado: any;
    private datePipe = inject(DatePipe);
    data = [];
    capital = [];
    estadoCredito = [];
    tasas = [];
    idCredito: string = '';
    public _matDialog = inject(MatDialog);

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    onSolicitud() {
        this._matDialog.open(DialogConfirmDesembolsoComponent, {
            data: {
                data: this.items
            },
            width: '30%',
            disableClose: true
        })
    }

    ngOnInit(): void {
        this.idCredito = this.activatedRoute.snapshot.paramMap.get('id');
        this.getCredito(this.idCredito);
    }

    getCredito(id) {
        this.subcription$ = this.creditoService.getCredito(id).subscribe((response) => {
            this.items = response.data;
        })
    }

    protected readonly CodigosDetalleConsumo = CodigosDetalleConsumo;
}
