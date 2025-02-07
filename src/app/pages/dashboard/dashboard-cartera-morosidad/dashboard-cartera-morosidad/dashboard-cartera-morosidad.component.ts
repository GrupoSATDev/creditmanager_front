import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { DecimalPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard-cartera-morosidad',
  standalone: true,
    imports: [
        FuseAlertComponent,
        NgApexchartsModule,
        NgIf,
        DecimalPipe,
    ],
  templateUrl: './dashboard-cartera-morosidad.component.html',
  styleUrl: './dashboard-cartera-morosidad.component.scss'
})
export class DashboardCarteraMorosidadComponent implements  OnInit{
    @ViewChild('chart') chart!: ChartComponent;
    public indicadoresService = inject(DashboardService);
    public chartOptions: ApexOptions;
    public loading = true;
    public montoCobroFijosGanados: number;
    public montoInteresesGanados: number;


    ngOnInit(): void {
        this.getIndicadoresCartera();
    }

    private getIndicadoresCartera() {
        this.indicadoresService.getCarteras().subscribe((response) => {
            const pagos = response.data;
            this.montoCobroFijosGanados = pagos.montoCobroFijosGanados || 0;
            this.montoInteresesGanados = pagos.montoInteresesGanados || 0;

            this.chartOptions = {
                series: [{
                    name: 'Total Pagos',
                    data: []
                }],
                chart: {
                    type: 'bar',
                    height: 400,
                    width: 600,
                    fontFamily: 'Inter, sans-serif',
                    toolbar: {
                        show: true,
                        tools: {
                            download: false,
                            selection: false,
                            zoom: false,
                            zoomin: false,
                            zoomout: false,
                            pan: false,
                        }
                    },
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 800
                    }
                },
                plotOptions: {
                    bar: {
                        borderRadius: 8,
                        columnWidth: '60%',
                        distributed: true,
                        dataLabels: {
                            position: 'top'
                        },
                    }
                },
                colors: [
                    '#155ee9', // Sky blue
                    '#14B8A6', // Teal
                    '#162683', // Violet
                    '#ff7e0b', // Amber
                    '#EC4899'  // Pink
                ],
                dataLabels: {
                    enabled: true,
                    formatter: function(val: number) {
                        return new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(val);
                    },
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ['#333']
                    }
                },
                title: {
                    text: 'Pagos Pendientes por Empresa',
                    align: 'center',
                    style: {
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#1F2937'
                    }
                },
                subtitle: {
                    text: 'Total de pagos por procesar',
                    align: 'center',
                    style: {
                        fontSize: '14px',
                        color: '#6B7280'
                    }
                },
                xaxis: {
                    categories: [],
                    labels: {
                        style: {
                            fontSize: '12px',
                            colors: '#4B5563'
                        },
                        rotate: -45,
                        rotateAlways: false,
                        trim: true,
                        maxHeight: 120
                    },
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    }
                },
                yaxis: {
                    title: {
                        text: 'Valores',
                        style: {
                            fontSize: '14px',
                            color: '#4B5563'
                        }
                    },
                    labels: {
                        formatter: function(val: number) {
                            return new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(val);
                        }
                    }
                },
                grid: {
                    borderColor: '#E5E7EB',
                    strokeDashArray: 4,
                    xaxis: {
                        lines: {
                            show: false
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    intersect: false,
                    y: {
                        formatter: function(val: number) {
                            return new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(val);
                        }
                    }
                }
            };

            // Procesar y agrupar los pagos por subempresa
            const pagosPorSubempresa = new Map<string, number>();

            pagos.pagosPendientes.forEach((pago: any) => {
                const totalActual = pagosPorSubempresa.get(pago.nombreSubempresa) || 0;
                pagosPorSubempresa.set(pago.nombreSubempresa, totalActual + pago.total);
            });

            // Actualizar las series del gráfico
            this.chartOptions.series = [{
                name: 'Total Pagos',
                data: Array.from(pagosPorSubempresa.values())
            }];

            // Actualizar las categorías
            this.chartOptions.xaxis.categories = Array.from(pagosPorSubempresa.keys());
            this.loading = false;

        })
    }

}
