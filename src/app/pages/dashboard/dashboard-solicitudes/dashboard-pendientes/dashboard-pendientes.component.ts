import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { MatTab, MatTabChangeEvent, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { CodigosEstadosSolicitudes } from '../../../../core/enums/estados-solicitudes';
import { ApexOptions,  NgApexchartsModule } from 'ng-apexcharts';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
    selector: 'app-dashboard-pendientes',
    standalone: true,
    imports: [
        FuseAlertComponent,
        MatTab,
        MatTabContent,
        MatTabGroup,
        NgIf,
        NgApexchartsModule,
    ],
    templateUrl: './dashboard-pendientes.component.html',
    styleUrl: './dashboard-pendientes.component.scss',
    providers: [
        DatePipe,
        CurrencyPipe
    ],
})
export class DashboardPendientesComponent implements OnInit, OnDestroy{
    public subcription$: Subscription;
    public tabIndex;
    private selectedTab: any = CodigosEstadosSolicitudes.PENDIENTE;
    public solicitudesService = inject(SolicitudesService);
    private datePipe = inject(DatePipe);
    private currencyPipe = inject(CurrencyPipe);
    data = [];
    public chartOptions: Partial<ApexOptions>;
    public capacidadMaxima: number = 100;
    pendientes = 0;
    private router = inject(Router);

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        console.log('tabChangeEvent => ', tabChangeEvent);
        console.log('index => ', tabChangeEvent.index);
        this.tabIndex = tabChangeEvent.index;
        console.log(this.tabIndex);
        this.selectedTab = tabChangeEvent.index == 0 ? CodigosEstadosSolicitudes.PENDIENTE : CodigosEstadosSolicitudes.APROBADA;
        this.getSolicitudes(this.selectedTab)
    };

    getSolicitudes(param): void {
        this.subcription$ = this.solicitudesService.getSolicitudes(param).subscribe((response) => {
            if (response) {
                this.data = response.data;
                this.updateChart();
            }else {
                this.data = [];
                this.updateChart();
            }
        }, error => {
            this.data = [];
            this.updateChart();
        })
    }

    ngOnDestroy(): void {
        this.subcription$.unsubscribe();
    }

    ngOnInit(): void {
        this.getSolicitudes(this.selectedTab);
        const porcentaje = (this.pendientes / this.capacidadMaxima) * 100;
        this.chartOptions = {
            series: [Math.round(porcentaje)],
            chart: {
                type: 'radialBar',
                height: 480,
                offsetY: 0,
                sparkline: {
                    enabled: false
                },
                events: {
                    click: (event, chartContext, config) => {
                        this.router.navigate(['/pages/gestion-creditos/solicitudes']);
                    }
                },
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 225,
                    hollow: {
                        margin: 0,
                        size: '70%',
                        background: '#FFF',
                        dropShadow: {
                            enabled: true,
                            top: 3,
                            left: 0,
                            blur: 4,
                            opacity: 0.24
                        }
                    },
                    track: {
                        background: '#e5e7eb', // track color
                        strokeWidth: '100%',
                        margin: 0,
                        dropShadow: {
                            enabled: false
                        }
                    },
                    dataLabels: {
                        show: true,
                        name: {
                            offsetY: -20,
                            show: true,
                            color: '#6b7280',
                            fontSize: '18px'
                        },
                        value: {
                            formatter: function(val) {
                                console.log(val);
                                return parseInt(val.toString(), 10).toString();
                            },
                            color: '#111827',
                            fontSize: '26px',
                            show: true,
                            offsetY: 10,
                        },
                        total: {
                            show: true,
                            fontSize: '14px',
                            color: '#374151',
                            formatter: () => `${this.pendientes}`
                        }
                    }
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'horizontal',
                    shadeIntensity: 0.5,
                    gradientToColors: ['#1e3a8a'],
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100]
                }
            },
            stroke: {
                lineCap: 'round'
            },
            labels: ['Percent'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            height: 280,
                        },
                        plotOptions: {
                            radialBar: {
                                dataLabels: {
                                    name: {
                                        fontSize: '16px',
                                    },
                                    value: {
                                        fontSize: '20px',
                                    },
                                    total: {
                                        fontSize: '12px'
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        };
    }

    private updateChart(): void {
        this.pendientes = this.data.length;
        const porcentaje = this.capacidadMaxima > 0 ?
            (this.pendientes / this.capacidadMaxima) * 100 :
            (this.pendientes > 0 ? 100 : 0);
        this.chartOptions = {
            ...this.chartOptions,
            series: [porcentaje],
        };
    }

}
