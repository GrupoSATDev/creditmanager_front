import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AesEncryptionService {

    private key = 'Credtest256***1112123weq'; // Clave usada en C#
    private iv = CryptoJS.enc.Utf8.parse('1a2b3c4d5e6f7g8h'); // IV de 16 bytes

    private getKey(): CryptoJS.lib.WordArray {
        return CryptoJS.SHA256(this.key); // Generar clave con SHA-256 (igual a C#)
    }

    encrypt(plainText: string): string {
        const encrypted = CryptoJS.AES.encrypt(
            plainText,
            this.getKey(),
            { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        );

        return encrypted.toString(); // Devuelve en Base64 (igual que en C#)
    }

    decrypt(cipherText: string): string {
        const decrypted = CryptoJS.AES.decrypt(
            cipherText, // Ahora pasamos el string directamente
            this.getKey(),
            { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        );

        return decrypted.toString(CryptoJS.enc.Utf8); // Convertimos el resultado a texto
    }
}
