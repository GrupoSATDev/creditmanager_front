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

    constructor() {


    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        console.log('tabChangeEvent => ', tabChangeEvent);
        console.log('index => ', tabChangeEvent.index);
        this.tabIndex = tabChangeEvent.index;
        console.log(this.tabIndex);
        this.selectedTab =
            tabChangeEvent.index == 0
                ? CodigosEstadosSolicitudes.PENDIENTE
                : tabChangeEvent.index == 1
                  ? CodigosEstadosSolicitudes.RECHAZADA
                  : tabChangeEvent.index == 2
                    ? CodigosEstadosSolicitudes.APROBADA
                    : CodigosEstadosSolicitudes.PENDIENTE;
        this.getSolicitudes(this.selectedTab)
    };

    getSolicitudes(param): void {

        this.subcription$ = this.solicitudesService.getSolicitudes(param).subscribe((response) => {
            if (response) {
                this.data = response.data;
                this.updateChart(); // Llama a la función para actualizar el gráfico
            }else {
                this.data = [];
                this.updateChart(); // Actualiza el gráfico incluso si no hay datos
            }
        }, error => {
            this.data = [];
            this.updateChart(); // Actualiza el gráfico en caso de error
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
                            label: 'Pendientes',
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

        // Calculamos el porcentaje para el radial bar.
        // Si capacidadMaximaReferencia es 0, evitamos la división por cero.
        const porcentaje = this.capacidadMaxima > 0 ?
            (this.pendientes / this.capacidadMaxima) * 100 :
            (this.pendientes > 0 ? 100 : 0); // Si hay pendientes y no hay máxima, mostrar 100%

        // Actualizamos la serie principal del gráfico radial. Solo hay una serie.
        this.chartOptions = {
            ...this.chartOptions, // Mantenemos las opciones existentes
            series: [porcentaje], // Actualizamos solo la serie con el nuevo porcentaje
        };

        // Para asegurarnos de que los formatters de 'value' y 'total' en el centro
        // siempre reflejen el valor actualizado de 'this.pendientes',
        // reasignamos sus funciones. Esto es importante porque 'this.data.length'
        // cambia después de la llamada a la API.
        if (this.chartOptions.plotOptions?.radialBar?.dataLabels?.value) {
            this.chartOptions.plotOptions.radialBar.dataLabels.value.formatter = (val: number) => {
                return `${this.pendientes}`; // Usamos el valor 'this.pendientes' actualizado
            };
        }
        if (this.chartOptions.plotOptions?.radialBar?.dataLabels?.total) {
            this.chartOptions.plotOptions.radialBar.dataLabels.total.formatter = (w: any) => {
                return `${this.pendientes}`; // Usamos el valor 'totalPendientes' actualizado
            };
        }
    }

}
