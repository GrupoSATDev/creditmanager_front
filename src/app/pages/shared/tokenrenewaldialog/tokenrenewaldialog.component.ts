import { Component } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { interval, take } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-tokenrenewaldialog',
  standalone: true,
    imports: [
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatDialogTitle,
        MatIcon,
    ],
  templateUrl: './tokenrenewaldialog.component.html',
  styleUrl: './tokenrenewaldialog.component.scss'
})
export class TokenrenewaldialogComponent {
    countDown = 30;

    constructor(private dialogRef: MatDialogRef<TokenrenewaldialogComponent>) {
        interval(1000)
            .pipe(take(30))
            .subscribe((val) => {
                this.countDown = 29 - val;
                if (this.countDown === 0) {
                    this.dialogRef.close(false);
                }
            });
    }

    onRenew(): void {
        this.dialogRef.close(true);
    }

    onLogout(): void {
        this.dialogRef.close(false);
    }

}
