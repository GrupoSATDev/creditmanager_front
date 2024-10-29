import { Routes } from '@angular/router';
import { FormBancosComponent } from './form-bancos/form-bancos.component';
import { GridBancosComponent } from './grid-bancos/grid-bancos.component';

export default [
    {
        path: '',
        component: GridBancosComponent
    }
] as Routes;
