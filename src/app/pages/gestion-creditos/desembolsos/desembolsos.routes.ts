import { Routes } from '@angular/router';
import { MainDesembolsosComponent } from './main-desembolsos/main-desembolsos.component';
import { FormDesembolsoComponent } from './form-desembolso/form-desembolso.component';
import { GridDesembolsosComponent } from './grid-desembolsos/grid-desembolsos.component';
import { FormApproveDesembolsoComponent } from './form-approve-desembolso/form-approve-desembolso.component';
import { FormViewDesembolsoComponent } from './form-view-desembolso/form-view-desembolso.component';

export default [
    {
        path: '',
        component: GridDesembolsosComponent
    },
    {
        path: 'desembolso/:id',
        component: FormApproveDesembolsoComponent
    },
    {
        path: 'registrar/:id',
        component: FormDesembolsoComponent
    },
    {
        path: 'view/:id',
        component: FormViewDesembolsoComponent
    },

] as Routes
