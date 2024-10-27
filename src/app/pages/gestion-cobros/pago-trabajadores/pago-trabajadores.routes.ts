import { Routes } from '@angular/router';
import { GridPagoTrabajadoresComponent } from './grid-pago-trabajadores/grid-pago-trabajadores.component';
import { FormPagoTrabajadoresComponent } from './form-pago-trabajadores/form-pago-trabajadores.component';
import { FormViewPagoTrabajadoresComponent } from './form-view-pago-trabajadores/form-view-pago-trabajadores.component';

export  default [
    {
        path: '',
        component: GridPagoTrabajadoresComponent
    },
    {
        path: 'pago',
        component: FormPagoTrabajadoresComponent
    },
    {
        path: 'pago/:id',
        component: FormViewPagoTrabajadoresComponent
    }

] as Routes;
