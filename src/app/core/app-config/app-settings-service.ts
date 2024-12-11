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
            base: EndPoints.uriBase('Municipios/Departamento'),
            baseMunicipio: EndPoints.uriBase('Municipios')
        }
    }

    public empresasMaestras = {
        url: {
            base: EndPoints.uriBase('EmpresaMaestras')
        }
    }

    public empresasClientes = {
        url: {
            base: EndPoints.uriBase('SubEmpresas'),
            baseTrabajador: EndPoints.uriBase('SubEmpresas/Clientes'),
        }
    }

    public tiposEmpresas = {
        url: {
            base: EndPoints.uriBase('TipoEmpresas')
        }
    }

    public tiposDocumentos = {
        url: {
            base: EndPoints.uriBase('TipoDocumentos')
        }
    }

    public generos = {
        url: {
            base: EndPoints.uriBase('Generos')
        }
    }

    public capitalInversion = {
        url: {
            base: EndPoints.uriBase('CapitalInversiones')
        }
    }

    public solicitudesCreditos = {
        url: {
            base: EndPoints.uriBase('Solicitudes')
        }
    }

    public tasasIntereses = {
        url: {
            base: EndPoints.uriBase('TasaIntereses')
        }
    }

    public tiposPagos = {
        url: {
            base: EndPoints.uriBase('TipoPagos')
        }
    }

    public empleados = {
        url: {
            base: EndPoints.uriBase('Trabajadores'),
            baseValidate: EndPoints.uriBase('Trabajadores/ValidaInfo')
        }
    }

    public cargos = {
        url: {
            base: EndPoints.uriBase('Cargos')
        }
    }

    public creditos = {
        url: {
            base: EndPoints.uriBase('Creditos')
        }
    }

    public estadoCreditos = {
        url: {
            base: EndPoints.uriBase('EstadoCreditos/Creditos'),
            baseCobros: EndPoints.uriBase('EstadoCreditos/CobroTrabajadores'),
            detalleConsumo: EndPoints.uriBase('EstadoCreditos/DetalleConsumo'),
        }
    }

    public detalleConsumos = {
        url: {
            base: EndPoints.uriBase('DetalleConsumos'),
            desembolsoBase: EndPoints.uriBase('DetalleConsumos/DetalleConsumoDesembolso'),
            baseTrabajador: EndPoints.uriBase('DetalleConsumos/Trabajador'),
            aliado: EndPoints.uriBase('DetalleConsumos/AllPagoAlido'),
            cobroFijo: EndPoints.uriBase('DetalleConsumos/DetalleConsumoCobroFijo'),
            detalleDesembolso: EndPoints.uriBase('DetalleConsumos/DesembolsoAprobados'),
            detalleDesembolsoRealizado: EndPoints.uriBase('DetalleConsumos/DesembolsoRealizado'),
            desembolso: EndPoints.uriBase('DetalleConsumos/Desembolso'),
        }
    }

    public cobroTrabajadores = {
        url: {
            base: EndPoints.uriBase('CobroTrabajadores'),
            baseTabla: EndPoints.uriBase('CobroTrabajadores/Tabla'),
            baseTrabajador: EndPoints.uriBase('CobroTrabajadores/AllTrabajador'),
            baseTrabajadorIndividual: EndPoints.uriBase('CobroTrabajadores/AllTrabajadorIndividual'),
        }
    }

    public subcripciones = {
        url: {
            base: EndPoints.uriBase('Subscripciones')
        }
    }

    public riesgos = {
        url: {
            base: EndPoints.uriBase('NivelesRiesgos')
        }
    }

    public bancos = {
        url: {
            base: EndPoints.uriBase('Bancos')
        }
    }

    public cuentasBancarias = {
        url: {
            base: EndPoints.uriBase('CuentasBancarias')
        }
    }

    public tipoConsumos = {
        url: {
            base: EndPoints.uriBase('TipoConsumos')
        }
    }

    public tipoCuentas = {
        url: {
            base: EndPoints.uriBase('TipoCuentas')
        }
    }

   public tipoSolicitudes = {
        url: {
            base: EndPoints.uriBase('TipoSolicitudes')
        }
    }

    public pagoAliados = {
        url: {
            base: EndPoints.uriBase('PagoAliados')
        }
    }

    public tipoContratos = {
        url: {
            base: EndPoints.uriBase('TipoContratos')
        }
    }

    public pagoTrabajadores = {
        url: {
            base: EndPoints.uriBase('PagoTrabajadores'),
            baseTipo: EndPoints.uriBase('TipoPagoTrabajadores')
        }
    }

    public deduccionesLegales = {
        url: {
            base: EndPoints.uriBase('DeduccionesLegales'),
        }
    }

    public subscripciones = {
        url: {
            base: EndPoints.uriBase('Subscripciones'),
        }
    }

    public usuarios = {
        url: {
            base: EndPoints.uriBase('Usuarios'),
        }
    }

    public tipoUsuarios = {
        url: {
            base: EndPoints.uriBase('TipoUsuarios'),
        }
    }

    public roles = {
        url: {
            base: EndPoints.uriBase('Roles'),
        }
    }

    public dashboard = {
        url: {
            base: EndPoints.uriBase('Indicadores')
        }
    }

    public cobrosFijos = {
        url: {
            base: EndPoints.uriBase('CobroFijos')
        }
    }

    public reportes = {
        url: {
            reporteConsumo: EndPoints.uriBase('Reportes/DetalleConsumoAliado')
        }
    }

    public cobroAliado = {
        url: {
            base: EndPoints.uriBase('CobroAliados')
        }
    }


}
