import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { QrCodeModule } from 'ng-qrcode';
import { MatButton } from '@angular/material/button';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-form-qr',
    standalone: true,
    imports: [
        QrCodeModule,
        MatButton,
        MatDialogClose,
        JsonPipe,
    ],
    templateUrl: './form-qr.component.html',
    styleUrl: './form-qr.component.scss',
})
export class FormQrComponent implements OnInit{
    public dialogRef = inject(MatDialogRef<FormQrComponent>);
    public _matData = inject(MAT_DIALOG_DATA);
    public qrDatas: string = null;
    public qrData: string = null;
    public nameTrabajaador: string = '';


    employee = {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        phone: '+1234567890'
    };

    ngOnInit(): void {
        this.nameTrabajaador = this._matData.data.nombreCompleto;
        this.qrDatas = JSON.stringify(this._matData.data);
        this.qrData = `https://example.com/employee/${this.employee.id}?name=${encodeURIComponent(this.employee.name)}&email=${encodeURIComponent(this.employee.email)}&phone=${encodeURIComponent(this.employee.phone)}`;

    }

}
