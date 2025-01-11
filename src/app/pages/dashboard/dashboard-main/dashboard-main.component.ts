import { Component, inject, OnInit } from '@angular/core';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe, NgIf } from '@angular/common';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { MatButton } from '@angular/material/button';
import { DateTime } from 'luxon';
import { DashboardService } from '../../../core/services/dashboard.service';
import { FuseAlertComponent } from '../../../../@fuse/components/alert';
import { CdkScrollable } from '@angular/cdk/scrolling';
const now = DateTime.now();
@Component({
  selector: 'app-dashboard-main',
  standalone: true,
    imports: [
        MatMenuTrigger,
        MatMenu,
        MatIcon,
        DecimalPipe,
        NgApexchartsModule,
        MatMenuItem,
        MatButton,
        NgIf,
        FuseAlertComponent,
        CdkScrollable,
    ],
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss'
})
export class DashboardMainComponent implements  OnInit{
    public indicadoresService = inject(DashboardService);

    dataCards: any;

    chartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            height: 350,
            width: 1000
        },
        labels: [],
        series: [],
        title: {
            text: 'Distribución de Solicitudes y Créditos',
            align: 'left',
            style: {
                fontSize: '18px',
                fontWeight: 'bold'
            }
        },
        colors: ['#28a745', '#dc3545', '#ffc107', '#007bff', '#6c757d', '#17a2b8'],
        legend: {
            position: 'right',
            horizontalAlign: 'right', // Centra verticalmente los elementos
            fontSize: '14px',
            markers: {
                width: 12,
                height: 12,
            },
            itemMargin: {
                horizontal: 5,
                vertical: 5
            }
        },
        dataLabels: {
            style: {
                fontSize: '12px',
            },
        }

    };

    constructor() {

    }

    ngOnInit(): void {
        this.getIndicadoresMontos();
    }

    private getIndicadores() {
        this.indicadoresService.getIndicadores().subscribe((response) => {
            if (response.data) {
                this.chartOptions.labels = [
                    'Solicitudes Aprobadas',
                    'Solicitudes Rechazadas',
                    'Solicitudes Pendientes',
                    'Créditos Aprobados',
                    'Créditos Rechazados',
                    'Créditos Pendientes'
                ];

                this.chartOptions.series = [
                    response.data.canSolicitudesAprobadas,
                    response.data.canSolicitudesRechazadas,
                    response.data.canSolicitudesPendientes,
                    response.data.canCreditosAprobados,
                    response.data.canCreditosRechazados,
                    response.data.canCreditosPendientes
                ];
            }
        })
    }
    private getIndicadoresMontos() {
        this.indicadoresService.getCardsMontos().subscribe((response) => {
            if (response.data) {

                this.dataCards = response.data;
            }
        })
    }

}
