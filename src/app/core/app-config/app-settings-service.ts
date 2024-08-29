import { Injectable } from '@angular/core';
import { EndPoints } from './end-points';

@Injectable({
    providedIn: 'root'
})
export class AppSettingsService {

    /**
     * @description: Login de usuario
     */
    public auth = {
        url: {
            base: EndPoints.uriBase('Usuarios/Login'),
        },
    };

    public departamentos = {
        url: {
            base: EndPoints.uriBase('Departamentos')
        }
    }

    public municipios = {
        url: {
            base: EndPoints.uriBase('Municipios/Departamento')
        }
    }

    public empresasMaestras = {
        url: {
            base: EndPoints.uriBase('EmpresaMaestras')
        }
    }


}
