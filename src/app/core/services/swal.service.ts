import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

interface ToastInterface {
    icon: 'error' | 'info' | 'question' | 'success' | 'warning';
    title: string;
    text?: string;
    html?: string;
    timer?: number;
}


@Injectable({
  providedIn: 'root'
})
export class SwalService {

    ToastAler({   icon,
                     title,
                     text = '',
                     html = '',
                     timer = 1000,
                 }: ToastInterface) {

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            },
        });
        Toast.fire({ icon, title, text, html });
    }

    // Alerta simple
    showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' = 'info') {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: 'Ok'
        });
    }

    // Alerta con confirmación
    showConfirm(title: string, text: string, icon: 'warning' = 'warning') {
        return Swal.fire({
            title: title,
            text: text,
            icon: icon,
            showCancelButton: true,
            confirmButtonColor: '#155ee9',
            cancelButtonColor: '#BABAB8',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        });
    }

    // Alerta automática con temporizador
    showAutoCloseAlert(title: string, text: string, timer: number = 3000) {
        Swal.fire({
            title: title,
            text: text,
            timer: timer,
            timerProgressBar: true,
            showConfirmButton: false
        });
    }

}
