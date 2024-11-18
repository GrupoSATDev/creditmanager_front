import { Component, OnInit } from '@angular/core';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

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
    ],
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss'
})
export class DashboardMainComponent implements  OnInit{
    data: any;
    chartConversions: ApexOptions;

    constructor() {

    }

    private _prepareChartData(): void {
        // Visitors


        // Conversions
        this.chartConversions = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'area',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#38BDF8'],
            fill: {
                colors: ['#38BDF8'],
                opacity: 0.5,
            },
            series: this.data?.conversions.series,
            stroke: {
                curve: 'smooth',
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            xaxis: {
                type: 'category',
                categories: this.data?.conversions.labels,
            },
            yaxis: {
                labels: {
                    formatter: (val): string => val.toString(),
                },
            },
        };


    }

    ngOnInit(): void {
        this._prepareChartData();
    }



}
