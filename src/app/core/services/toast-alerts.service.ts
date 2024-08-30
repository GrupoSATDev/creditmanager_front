import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastAlertInterface } from '../../interfaces/toast-alert';

@Injectable({
  providedIn: 'root'
})
export class ToastAlertsService {

  constructor(
      private snackBar: MatSnackBar
  ) { }

    toasAlertWarn(optionAlert: ToastAlertInterface): void {
        const { message, actionMessage, duration } = optionAlert;
        const messageClose = 'Cerrar';
        this.snackBar.open(message, actionMessage || messageClose, {
            duration: duration || 4000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: 'alert-warn'
        });
    }
}
