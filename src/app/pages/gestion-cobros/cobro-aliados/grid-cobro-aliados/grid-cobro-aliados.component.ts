import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { IButton } from '../../../shared/interfaces/buttonsInterfaces';
import { MatTab, MatTabChangeEvent, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { EstadoCobroAliados } from '../../../../core/enums/estado-cobro-aliados';
import { CobroAliadosService } from '../../../../core/services/cobro-aliados.service';
import { MatButton } from '@angular/material/button';
import { exportar } from '../../../../core/constant/dialogs';
import * as XLSX from 'xlsx';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { DialogCobroAliadoComponent } from '../dialog-cobro-aliado/dialog-cobro-aliado.component';
import { EstadosDatosService } from '../../../../core/services/estados-datos.service';

@Component({
  selector: 'app-grid-cobro-aliados',
  standalone: true,
    imports: [
        AsyncPipe,
        CustomTableComponent,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        NgForOf,
        NgIf,
        MatTabGroup,
        FuseAlertComponent,
        MatTab,
        MatTabContent,
        MatButton,
        NgClass,
    ],
    providers: [
        DatePipe,
        CurrencyPipe
    ],
  templateUrl: './grid-cobro-aliados.component.html',
  styleUrl: './grid-cobro-aliados.component.scss'
})
export class GridCobroAliadosComponent implements OnInit, OnDestroy {
    private datePipe = inject(DatePipe);
    private router = inject(Router);
    private selectedTab: any = EstadoCobroAliados.PENDIENTES;
    private currencyPipe = inject(CurrencyPipe);
    private cobroAliadoService = inject(CobroAliadosService);
    public fuseService = inject(FuseConfirmationService);
    public estadosDatosService = inject(EstadosDatosService);

    public subcription$: Subscription;
    public selectedData: any;
    public searchTerm: string = '';
    public _matDialog = inject(MatDialog);


    data = [];

    columns = ['Empresa', 'Fecha inicial', 'Total', 'Estado'];

    columnPropertyMap = {
        'Empresa': 'nombreSubEmpresa',
        'Fecha inicial': 'fechaIncial',
        'Fecha final': 'fechaFinal',
        'Total': 'total',
        'Estado': 'nombreEstadoCobro',
    };

    buttons: IButton[] = [
        {
            label: 'View',
            icon: 'visibility',
            action: (element) => {
                console.log('Editing', element);
                this.selectedData = element;
                this.router.navigate(['pages/gestion-cobros/cobro-aliado/factura', this.selectedData.id])
            }
        },
        {
            label: 'post_add',
            icon: 'post_add',
            action: (element) => {
                console.log('Editing', element);
                this.onUpdateCobro(element)
            }
        },
    ];

    buttonsView: IButton[] = [
        {
            label: 'View',
            icon: 'visibility',
            action: (element) => {
                console.log('Editing', element);
                this.selectedData = element;
                this.router.navigate(['pages/gestion-cobros/cobro-aliado/factura', this.selectedData.id])
            }
        },
    ];

    onUpdateCobro(data) {
        this._matDialog.open(DialogCobroAliadoComponent, {
            data: {
                data: data
            },
            width: '30%',
            disableClose: true
        })
    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        this.selectedTab =
            tabChangeEvent.index == 0 ? EstadoCobroAliados.PENDIENTES : EstadoCobroAliados.PAGADOS;
        this.getAliados(this.selectedTab);
    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchTerm = target.value.trim().toLowerCase();
    }

    getAliados(params) {
        this.subcription$ = this.cobroAliadoService.getCobroAliado(params).pipe(
            map((response) => {
                response.data.forEach((items) => {
                    items.fechaCreacion = this.datePipe.transform(items.fechaCreacion, 'dd/MM/yyyy');
                    items.fechaIncial = this.datePipe.transform(items.fechaIncial, 'dd/MM/yyyy');
                    items.fechaFinal = this.datePipe.transform(items.fechaFinal, 'dd/MM/yyyy');
                    items.total = this.currencyPipe.transform(items.total, 'USD', 'symbol', '1.2-2');
                })
                return response;
            })
        ).subscribe((response) => {
            if (response) {
                this.data = response.data;
            }else {
                this.data = [];
            }
        }, error => {
            this.data = [];
        })
    }

    exportToExcel(data: any[]) {
        const dialog = this.fuseService.open({
            ...exportar
        });

        dialog.afterClosed().subscribe((response) => {
            if (response === 'confirmed') {
                // Create worksheet
                const worksheet = XLSX.utils.json_to_sheet(data);

                // Create workbook
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

                // Export file
                XLSX.writeFile(workbook, 'exported_data.xlsx');
            }
        })

    }

    private listenGrid() {
        const refreshData$ = this.estadosDatosService.stateGrid.asObservable();

        refreshData$.subscribe((state) => {
            if (state) {
                this.getAliados(this.selectedTab);
            }
        })

    }


    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngOnInit(): void {
        this.getAliados(this.selectedTab);
        this.listenGrid();
    }

}
