import { Routes } from '@angular/router';
import { GridPagoTrabajadorComponent } from './grid-pago-trabajador/grid-pago-trabajador.component';
import { FormPagoTrabajadorComponent } from './form-pago-trabajador/form-pago-trabajador.component';
import { FormViewPagoTrabajadorComponent } from './form-view-pago-trabajador/form-view-pago-trabajador.component';

export default [
    {
        path: '',
        component: GridPagoTrabajadorComponent
    },
    {
        path: 'individual',
        component: FormPagoTrabajadorComponent
    },
    {
        path: 'individual/:id',
        component: FormViewPagoTrabajadorComponent
    },


] as Routes;
