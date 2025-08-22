import { inject, Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { AuthCoreService } from './auth-core.service';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
private secretKey = ''; // Store this securely
  private _AuthCoreService = inject(AuthCoreService);


  Encrypt(_data: string | object): string {
    if (typeof _data == 'object') {
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

  CryptoJSAesJson = {
    stringify: function (cipherParams:any) {
      let j: any = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
      if (cipherParams.iv) j.iv = cipherParams.iv.toString();
      if (cipherParams.salt) j.s = cipherParams.salt.toString();
      return JSON.stringify(j);
    },
    parse: function (jsonStr:any) {
      let j: any = JSON.parse(jsonStr);
      let cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(j.ct) });
      if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
      if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
      return cipherParams;
    }
  }

  encrypt(data: any) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.getKey(), { format: this.CryptoJSAesJson }).toString();
  }

  decrypt(body: any) {
    return JSON.parse(CryptoJS.AES.decrypt(body, this.getKey(), { format: this.CryptoJSAesJson }).toString(CryptoJS.enc.Utf8));
  }

  private getKey() {
    const token = this._AuthCoreService.token();
    if (!token) {
      return environment.defaultKey;
    }
    return token
      .replace('Bearer ', '')
      .replace(/X/g, 'a')
      .replace(/x/g, 'A')
      .replace(/(.)(.)(.)/g, "$1$2");
  }
}
