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
    public qrDatas: any = null;
    public qrData: string = null;


    employee = {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        phone: '+1234567890'
    };

    ngOnInit(): void {
        const data = this._matData.data;
        this.qrDatas = data;
        this.qrData = `https://admin.crediplus.com.co/pages/gestion-creditos/detalle-consumo/${data.idTipoDoc}/${data.numDoc}`;
        console.log(this.qrData)
    }

}
