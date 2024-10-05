import { Routes } from '@angular/router';
import { GridCobrosEmpleadosComponent } from './grid-cobros-empleados/grid-cobros-empleados.component';
import { FormCobrosEmpleadosComponent } from './form-cobros-empleados/form-cobros-empleados.component';

export default [
    {
        path: '',
        component: GridCobrosEmpleadosComponent
    },
    {
        path: 'cobro/:id',
        component: FormCobrosEmpleadosComponent
    }

] as Routes
