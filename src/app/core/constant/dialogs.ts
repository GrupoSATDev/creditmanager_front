import { FuseConfirmationConfig } from '../../../@fuse/services/confirmation';

export const guardar: FuseConfirmationConfig = {
    title: 'Guardar',
    message: '¿Está seguro de guardar el registro?',
    icon: {
        show: true,
        name: 'heroicons_solid:question-mark-circle',
        color: 'info',
    },
    actions: {
        confirm: {
            show: true,
            label: 'Guardar',
            color: 'bg-crediblue-50'
        },
        cancel: {
            show: true,
            label: 'Cancelar',
        }
    }
}

export const cancelar: FuseConfirmationConfig = {
    title: 'Guardar',
    message: '¿Está seguro de rechazar el registro?',
    icon: {
        show: true,
        name: 'heroicons_solid:question-mark-circle',
        color: 'info',
    },
    actions: {
        confirm: {
            show: true,
            label: 'Guardar',
            color: 'primary'
        },
        cancel: {
            show: true,
            label: 'Cancelar',
        }
    }
}
