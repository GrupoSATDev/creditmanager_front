import { Component, inject, OnInit } from '@angular/core';
import { FuseAlertComponent } from '../../../../../@fuse/components/alert';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard-rentabilidad-intereses',
  standalone: true,
    imports: [
        FuseAlertComponent,
        NgApexchartsModule,
        NgIf,
    ],
  templateUrl: './dashboard-rentabilidad-intereses.component.html',
  styleUrl: './dashboard-rentabilidad-intereses.component.scss'
})
export class DashboardRentabilidadInteresesComponent implements  OnInit {
    public indicadoresService = inject(DashboardService);
    chartOptions: ApexOptions;

    ngOnInit(): void {
        this.getIndicadores();
    }

    private getIndicadores() {
        this.indicadoresService.getRentabilidadInteres().subscribe((response) => {
            console.log(response);
            const montoInteresesPendientes = response.data.montoInteresesPendientesPorLiquidar || 0;
            const montoInteresesGanados = response.data.montoInteresesGanadosDeLiquidaciones || 0;

            this.chartOptions = {
                series: [montoInteresesPendientes, montoInteresesGanados], // Valores de las categorías
                chart: {
                    type: 'donut',
                    height: 400,
                    width: 700 // Reduce el ancho para centrar mejor el contenido
                },
                labels: ['Intereses Pendientes por Liquidar', 'Intereses Ganados de Liquidaciones'],
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 300
                            },
                            legend: {
                                position: 'bottom', // Leyenda abajo
                                fontSize: '12px'
                            }
                        }
                    }
                ],
                title: {
                    text: 'Distribución de Intereses',
                    align: 'left', // Centrar el título
                    style: {
                        fontSize: '18px',
                        fontWeight: 'bold'
                    }
                },
                legend: {
                    position: 'bottom', // Leyenda en la parte inferior
                    horizontalAlign: 'center', // Centrada horizontalmente
                    fontSize: '14px', // Tamaño de fuente más grande
                    labels: {
                        colors: ['#333'], // Mantén el color oscuro
                        useSeriesColors: true // Usa los colores de las series
                    },
                    itemMargin: {
                        horizontal: 10, // Espaciado entre ítems
                        vertical: 8
                    }
                },
                dataLabels: {
                    enabled: true, // Muestra etiquetas dentro del gráfico
                    style: {
                        fontSize: '16px', // Tamaño más grande
                        fontWeight: 'bold',
                        colors: ['#fff'] // Etiquetas en blanco
                    },
                    dropShadow: {
                        enabled: true,
                        top: 1,
                        left: 1,
                        blur: 2,
                        color: '#000',
                        opacity: 0.6
                    }
                },
                tooltip: {
                    enabled: true,
                    style: {
                        fontSize: '13px'
                    },
                    y: {
                        formatter: function (val) {
                            return `\$${val.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}`;
                        }
                    }
                }
            }
        })
    }

}
