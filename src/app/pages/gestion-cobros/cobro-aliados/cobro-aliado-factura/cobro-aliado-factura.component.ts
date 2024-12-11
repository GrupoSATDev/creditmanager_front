import { Component, inject, OnInit } from '@angular/core';
import { CobroAliadosService } from '../../../../core/services/cobro-aliados.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-cobro-aliado-factura',
  standalone: true,
    imports: [
        CurrencyPipe,
        DatePipe,
        CdkScrollable,
    ],
  templateUrl: './cobro-aliado-factura.component.html',
  styleUrl: './cobro-aliado-factura.component.scss'
})
export class CobroAliadoFacturaComponent implements OnInit{
    public subcription$: Subscription;
    private cobroAliadoService = inject(CobroAliadosService);
    private activatedRoute = inject(ActivatedRoute);
    public detalleFactura: any;



    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.getAliado(id);
    }

    getAliado(id) {
        this.subcription$ = this.cobroAliadoService.getCobroAliados(id).subscribe((response) => {
            if (response.data) {
                this.detalleFactura = response.data;
            }
        })
    }

}
