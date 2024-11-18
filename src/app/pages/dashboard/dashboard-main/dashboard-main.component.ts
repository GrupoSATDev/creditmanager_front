import { Component, OnInit } from '@angular/core';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { MatButton } from '@angular/material/button';
import { DateTime } from 'luxon';
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
    ],
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss'
})
export class DashboardMainComponent implements  OnInit{


    chartOptions: ApexOptions = {};

    constructor() {

    }

    ngOnInit(): void {
        this.chartOptions = {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 8,
                    horizontal: false
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: ['Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre']
            },
            yaxis: {
                title: {
                    text: 'Solicitudes'
                }
            },
            title: {
                text: 'Solicitudes de Crédito por Mes',
                align: 'center',
                style: {
                    fontSize: '18px',
                    fontWeight: 'bold'
                }
            },
            colors: ['#1E90FF'],
            series: [
                {
                    name: 'Solicitudes',
                    data: [30, 45, 50, 60, 80, 70] // Datos de ejemplo
                }
            ]
        };
    }

}
