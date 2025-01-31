import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AesEncryptionService {

    private key: string;
    private iv: string;

    constructor() {
        this.key = 'your-secret-key-here'; // Debe coincidir con la clave en .NET
        this.iv = 'your-iv-here'; // Debe coincidir con el IV en .NET
    }

    encrypt(plainText: string): string {
        const key = CryptoJS.enc.Utf8.parse(this.key);
        const iv = CryptoJS.enc.Utf8.parse(this.iv);

        const encrypted = CryptoJS.AES.encrypt(plainText, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return encrypted.toString();
    }

    decrypt(cipherText: string): string {
        const key = CryptoJS.enc.Utf8.parse(this.key);
        const iv = CryptoJS.enc.Utf8.parse(this.iv);

        const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}
