import { Routes } from '@angular/router';
import { GridSolicitudesComponent } from './grid-solicitudes/grid-solicitudes.component';
import { FormApproveComponent } from './form-approve/form-approve.component';

export default [
    {
        path: '',
        component: GridSolicitudesComponent
    },
    {
        path: 'estados/:id',
        component: FormApproveComponent
    }

]as Routes;
