import { Routes } from '@angular/router';
import { GridCreditoConsumosComponent } from './grid-credito-consumos/grid-credito-consumos.component';
import { FormViewCreditoConsumosComponent } from './form-view-credito-consumos/form-view-credito-consumos.component';


export default   [
    {
        path: '',
        component: GridCreditoConsumosComponent
    },
    {
        path: 'consumo/:id',
        component: FormViewCreditoConsumosComponent
    }

] as Routes;
