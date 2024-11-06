import { Routes } from '@angular/router';
import { MainDesembolsosComponent } from './main-desembolsos/main-desembolsos.component';
import { FormDesembolsoComponent } from './form-desembolso/form-desembolso.component';
import { GridDesembolsosComponent } from './grid-desembolsos/grid-desembolsos.component';

export default [
    {
        path: '',
        component: MainDesembolsosComponent
    },
    {
        path: 'registrar',
        component: FormDesembolsoComponent
    },
    {
        path: 'listar',
        component: GridDesembolsosComponent
    },

] as Routes
