import { Routes } from '@angular/router';
import { FormSubscripcionesComponent } from './form-subscripciones/form-subscripciones.component';
import { MainSubscripcionesComponent } from './main-subscripciones/main-subscripciones.component';
import { GridSubscripcionComponent } from './grid-subscripcion/grid-subscripcion.component';

export default [
    {
        path: '',
        component: MainSubscripcionesComponent
    },
    {
        path: 'listar',
        component: GridSubscripcionComponent
    },
    {
        path: 'registrar',
        component: FormSubscripcionesComponent
    }

] as Routes;
