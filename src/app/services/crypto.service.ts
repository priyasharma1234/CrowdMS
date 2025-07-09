import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private secretKey = ''; 

  Encrypt(_data: string | object): string {
    if(typeof _data == 'object') {
      _data = JSON.stringify(_data);
    }
    const key = CryptoJS.enc.Utf8.parse('1234567890123456'); // 16-byte key
    const iv = CryptoJS.enc.Utf8.parse('6543210987654321');  // 16-byte IV



    const enc = CryptoJS.AES.encrypt(_data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
    }).toString();
    console.log('Encrypted Data:', enc);
    return enc;
  }

  Decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
