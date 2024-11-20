import { Component, inject, OnInit } from '@angular/core';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe, NgIf } from '@angular/common';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { MatButton } from '@angular/material/button';
import { DateTime } from 'luxon';
import { DashboardService } from '../../../core/services/dashboard.service';
import { FuseAlertComponent } from '../../../../@fuse/components/alert';
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
    ],
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss'
})
export class DashboardMainComponent implements  OnInit{
    public indicadoresService = inject(DashboardService);

    chartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            height: 350
        },
        labels: [],
        series: [],
        title: {
            text: 'Distribución de Solicitudes y Créditos',
            align: 'center',
            style: {
                fontSize: '18px',
                fontWeight: 'bold'
            }
        },
        colors: ['#28a745', '#dc3545', '#ffc107', '#007bff', '#6c757d', '#17a2b8'],
        legend: {
            position: 'bottom'
        }
    };

    constructor() {

    }

    ngOnInit(): void {
        this.getIndicadores();

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

}
