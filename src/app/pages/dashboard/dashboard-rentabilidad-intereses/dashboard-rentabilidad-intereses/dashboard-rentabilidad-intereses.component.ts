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
                    width: 1000
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
                                position: 'bottom'
                            }
                        }
                    }
                ],
                title: {
                    text: 'Distribución de Intereses',
                    align: 'center',
                    style: {
                        fontSize: '18px',
                        fontWeight: 'bold'
                    }
                }
            };
        })
    }

}
