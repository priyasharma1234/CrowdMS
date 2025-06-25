import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpEvent } from '@angular/common/http';
import { from, Observable, switchMap, of, delay, tap, map } from 'rxjs';
import JSEncrypt from 'jsencrypt';

@Injectable({
  providedIn: 'root'
})

// export class AuthHeaderInterceptor implements HttpInterceptor {
//   key: any;
//   iv: any;
//   $encrypt = new JSEncrypt(); 
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

//     // encrypting the requset data before sending to the backend through api
//     let encDt = this.encryptRequestRSA(req.body);  
//     const modified = req.clone({
//       body: { encryptString: encDt }
//     });

//     return new Observable(observer => {
//       // hitting api and subscribing the response data
//       const subscription = next.handle(modified).subscribe(
//         {
//           next: (event: any) => {
//             // here, checking is event is response or not
//             if (event instanceof HttpResponse) {
//               // if the event is response the decrypt function will call and decrypted return data will set into response body
//               event.body.res = JSON.parse(this.decryptResponse(event.body));

//               //checking is any error in response 
//               if (event.body.statuscode && event.body.statuscode !== 404) {
//                 observer.next(event);
//                  //console.log("observer event ",  event.body.data);
//               }

//               // if there is no error observer will go to the next, means component will able to fetch the data
//               observer.next(event);
//                //console.log("observer event ",  event.body.data);
//             }
//           },
//           // if countring any error whiling subscribing the api , will show the error 
//           error: (error) => {
//             alert('error' + error);
//             observer.error(error);
//           },

//           // if everything goes fine , then observable will complete 
//           complete: () => observer.complete()
//         }

//       );

//       // remove request from queue when cancelled
//       return () => {
//         subscription.unsubscribe();
//       };
//     });

//   }

//   // function for encrypt data  with RSA PUBLIC KEY
//   encryptRequestRSA(data: any){
//     this.$encrypt.setPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7Gkcg4rg13s6XcFnk9T5sDWcGnXxw7tTQ6LSCWKHxPP830PpWdnL8WlnHZuFgvH4OkzTQb5TFEYlAtWLtV/QVMaFUlRLR+K/4oUcqYTZfxQCmAgiivmz3Lv5rEokM0wOioukv3kmd+UaUGwoXFlSQ9hrSBfJAr5JwQb/zlCw6RQIDAQAB");
//       let ndata = this.$encrypt.encrypt(data);
//       //console.log("encrypt data ", ndata)
//        return ndata
//   }

//   // function for decrypt data WIth Sha-256-CBC
//   decryptResponse(data: any) {
//      // console.log("decrypt data ",data)
//     this.key = data.dk;
//     this.iv = 'l0wB8Q88i4QNF3DB';
//     let cipher = CryptoJS.AES.decrypt(data.d, CryptoJS.enc.Utf8.parse(this.key), {
//       iv: CryptoJS.enc.Utf8.parse(this.iv),
//       mode: CryptoJS.mode.CBC,
//     });
//     return cipher.toString(CryptoJS.enc.Utf8);
//   }
// }

export class AuthHeaderInterceptor implements HttpInterceptor {
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(httpRequest);
  }
}