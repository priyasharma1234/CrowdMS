import { config } from './request-url.service';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from './session-storage.service';
@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  //
  // constructor(
  //   private sessionStorage: SessionStorageService,
  // ) { }
  //
  // aesEncrypt(data: any) {
  //   let key = config.aesEnc.key; //length 32
  //   let iv = config.aesEnc.iv;
  //   let cipher = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(key), {
  //     iv: CryptoJS.enc.Utf8.parse(iv),
  //     mode: CryptoJS.mode.CBC,
  //   });
  //   return cipher.toString();
  // }
  // aesDecrypt(data: any) {
  //   let key = config.aesEnc.key; //length 32
  //   let iv = config.aesEnc.iv;
  //   let cipher = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
  //     iv: CryptoJS.enc.Utf8.parse(iv),
  //     mode: CryptoJS.mode.ECB,
  //   });
  //   return cipher.toString(CryptoJS.enc.Utf8);
  // }
  //
  // CryptoJSAesJson = {
  //   stringify: function (cipherParams:any) {
  //     let j: any = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
  //     if (cipherParams.iv) j.iv = cipherParams.iv.toString();
  //     if (cipherParams.salt) j.s = cipherParams.salt.toString();
  //     return JSON.stringify(j);
  //   },
  //   parse: function (jsonStr:any) {
  //     let j: any = JSON.parse(jsonStr);
  //     let cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(j.ct)});
  //     if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
  //     if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
  //     return cipherParams;
  //   }
  // }
  //
  // encrypt(data: any) {
  //   return CryptoJS.AES.encrypt(JSON.stringify(data), this.getKey(), {format: this.CryptoJSAesJson}).toString();
  // }
  //
  // decrypt(body: any) {
  //   return JSON.parse(CryptoJS.AES.decrypt(body, this.getKey(), {format: this.CryptoJSAesJson}).toString(CryptoJS.enc.Utf8));
  // }
  //
  // private getKey() {
  //   let session = this.sessionStorage.getItem('userDetails');
  //   let token;
  //   if (session) {
  //     token = JSON.parse(session).token; // getting login session to set in headers
  //   }
  //
  //   if(!session) {
  //     return environment.defEncKey;
  //   }
  //   let key = token;
  //   key = key.replace('Bearer ', '');
  //   key = key.replace(/X/g, 'a');
  //   key = key.replace(/x/g, 'A');
  //   key = key.replace(/(.)(.)(.)/g, "$1$2");
  //
  //   return key;
  // }
  //
}
