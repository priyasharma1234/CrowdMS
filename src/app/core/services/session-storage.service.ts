import { CookieService } from 'ngx-cookie-service';
import { config } from './request-url.service';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  tokenFromUI: string = "0123456789123456";
  encrypted: any = "";
  decrypted: any;

  request: string;
  responce: string;

  constructor(
    private cookiesService: CookieService,
  ) { }

  // *********************************************session storage related functions**************************************************************
  // saving or storing items to the session storage
  setItem(key: string, item: any) {
    this.encryptUsingAES256(key, item);
  };

  // getting item from session storage
  getItem(key: string) {
    let encryptedData = sessionStorage.getItem(key);
    let data = this.decryptUsingAES256(encryptedData);
    return data;
  };

  // clearing everything from session storage
  clearStorage() {
    sessionStorage.clear();
    this.cookiesService.deleteAll();
    localStorage.clear()
  };

  // removing an item from session storage
  removeItem(key: string) {
    sessionStorage.removeItem(key);
  };

  // ****************************************************************************************************************

  // *********************************cookies related function********************************************************
  setCookies(key:any, value:any) {
    this.encryptUsingAES256(key, value, 'cookies')
  };

  getCookies(key:any) {
    let cookiesValue = this.cookiesService.get(key);
    let data = this.decryptUsingAES256(cookiesValue);
    return data;
  };
  // *****************************************************************************************************************

  // saving or storing items to the local storage
  setItemLocalStorage(key: string, value: any) {
    this.encryptUsingAES256(key, value, 'local')
  }

  // getting item from local storage
  getItemLocalStorage(key: string) {
    let encryptedData = localStorage.getItem(key);
    let data = this.decryptUsingAES256(encryptedData);
    return data;
  }


  encryptUsingAES256(key:any, request:any, storage?:any) {
    // console.log("request to encrypt ", request)
    let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(request), _key, {
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    let d = encrypted.toString();
    // console.log("enck", d)
    if (storage == 'cookies') {
      this.cookiesService.set(key, d)
    } else if (storage == 'local') {
      localStorage.setItem(key, d)
    }
    sessionStorage.setItem(key, d);
  };

  decryptUsingAES256(encryptedData:any): any {
    // let data = JSON.parse(encryptedData);
    if (encryptedData) {
      let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
      let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);

      return CryptoJS.AES.decrypt(
        encryptedData, _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
    }

  };

}
