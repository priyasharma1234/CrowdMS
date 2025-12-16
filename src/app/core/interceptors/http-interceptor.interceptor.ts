
import { inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, throwError } from 'rxjs';

import Swal from 'sweetalert2';
import { AuthCoreService } from 'src/app/services/auth-core.service';
import { NgxToasterService } from '../services/toasterNgs.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SessionStorageService } from '../services/session-storage.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { ENCRYPT_REQUEST } from 'src/app/services/api-request.service';
import { environment } from 'src/environments/environment';


@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {
  //   loginSession: any;
  //   form_keys: any;

  //   secureCall: boolean = false;
  //   private requests: HttpRequest<any>[] = [];


  //   constructor(
  //     private _LoaderService: LoaderService,
  //     private _AuthCoreService: AuthCoreService,
  //     private toaster: NgxToasterService,
  //     private _CryptoService: CryptoService
  //   ) {
  //   }

  //   removeRequest(req: HttpRequest<any>) {
  //     const i = this.requests.indexOf(req);
  //     if (i >= 0) {
  //       this.requests.splice(i, 1);
  //     }
  //     this._LoaderService.setLoading(this.requests.length > 0);
  //   }

  //   intercept(request: HttpRequest<any> | any, next: HttpHandler): Observable<HttpEvent<any>> {
  //     this.secureCall = this._AuthCoreService.encrypted() ?? true;
  //     this.requests.push(request);

  //     if (request.headers['lazyUpdate']) {
  //       this.form_keys = request.headers['lazyUpdate'][0].value;
  //     }
  //     this._LoaderService.show();
  //     this.loginSession = ''
  //     let token = this._AuthCoreService.token();
  //     if (token) {
  //       this.loginSession = token

  //     }

  //     var headers = new HttpHeaders({
  //       // adding login session in api's header
  //       'Authorization': this.loginSession ? 'Bearer ' + this.loginSession : '',
  //       'token': '22509F2AE7BA71E4C3FB32AB94B6CEA8',
  //     })

  //     let shouldEncrypt: boolean = true;
  //     let body: any = {};
  //     if (request.body instanceof FormData) {
  //       for (let key of request.body.keys()) {
  //         if (key == 'encrypt') {
  //           shouldEncrypt = false;
  //           request.body.delete('encrypt');
  //           break;
  //         }
  //         body[key] = request.body.get(key);
  //       }
  //     } else {
  //       body = request.body;
  //     }

  //     if (shouldEncrypt && this.secureCall) {
  //       request.body = body;
  //       request.body = this._CryptoService.encrypt(request.body);
  //     }

  //     const requestmod = request.clone({
  //       // headers
  //     });
  //     return new Observable(observer => {
  //       const subscription = next.handle(requestmod).subscribe(
  //         {
  //           next: (event) => {
  //             if (event instanceof HttpResponse) {

  //               let shouldDecrypt = shouldEncrypt;
  //               if (shouldDecrypt && this.secureCall) {
  //                 event = event.clone({
  //                   body: this._CryptoService.decrypt(JSON.stringify(event.body))
  //                 })
  //               }

  //               if (event.status != 400 && event.status != 401) {
  //                 observer.next(event);
  //               } else {
  //                 this._AuthCoreService.logout();
  //                 const Toast = Swal.mixin({
  //                   toast: true,
  //                   position: 'top-end',
  //                   showConfirmButton: false,
  //                   timer: 3000,
  //                   timerProgressBar: true,
  //                   didOpen: (toast) => {
  //                     toast.addEventListener('mouseenter', Swal.stopTimer)
  //                     toast.addEventListener('mouseleave', Swal.resumeTimer)
  //                   }
  //                 })
  //                 Toast.fire({
  //                   icon: 'warning',
  //                   title: 'Session Expired!!'
  //                 })
  //               }
  //               this.removeRequest(request);

  //             }
  //           },
  //           error: (err) => {
  //             this.removeRequest(request);
  //             let shouldDecrypt = shouldEncrypt;

  //             if (shouldDecrypt && this.secureCall) {
  //               err['error'] = this._CryptoService.decrypt(JSON.stringify(err['error']))
  //             }
  //             if (err.error.statuscode == 400 || err.error.statuscode == 401 || err.error.statuscode == 520) {
  //               this._AuthCoreService.logout(false);
  //             } else if (err.error.statuscode == 422) {
  //               if (err?.error?.errors && Object.keys(err.error.errors).length > 0) {
  //                 for (const key in err.error.errors) {
  //                   const elementValue = err.error.errors[key];
  //                   const element = Array.isArray(elementValue) ? elementValue[0] : elementValue;
  //                   // if (this.form_keys) {
  //                   //   this.form_keys.get(key)?.setErrors({ 'dynError': element.split('<br')[0] });
  //                   // }
  //                   this.toaster.showError(element.split('<br')[0] ?? 'Session Expired!!', 'Error');
  //                 }
  //               } else {
  //                 this.toaster.showError(err.error.message, 'Error');
  //               }
  //             } else if (err.error.statuscode == 500) {
  //               this.toaster.showError(err.error.message, 'Error');
  //             } else {
  //               observer.error(err);
  //             }
  //           },
  //           complete: () => {
  //             this.removeRequest(request);
  //             observer.complete();
  //           }
  //         }
  //       );
  //       // remove request from queue when cancelled
  //       return () => {
  //         this.removeRequest(request);

  //         subscription.unsubscribe();
  //       };
  //     });

  //   }

  // }

  loginSession: any;
  form_keys: any;

  secureCall: boolean = false;
  private requests: HttpRequest<any>[] = [];
  private refreshingToken = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);


  constructor(
    private _LoaderService: LoaderService,
    private _AuthCoreService: AuthCoreService,
    private toaster: NgxToasterService,
    private _CryptoService: CryptoService,
    private http: HttpClient
  ) {
  }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this._LoaderService.setLoading(this.requests.length > 0);
  }

  intercept(request: HttpRequest<any> | any, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (request.url.includes('auth/refresh-token')) {
    //   return next.handle(request).pipe(finalize(() => {
    //     this.removeRequest(request);
    //   }));
    // }

    // this.secureCall = this._AuthCoreService.encrypted() ?? true;
    this.requests.push(request);


    if (request.headers['lazyUpdate']) {
      this.form_keys = request.headers['lazyUpdate'][0].value;
    }
    this._LoaderService.show();
    this.loginSession = ''
    let token = this._AuthCoreService.token();
    if (token) {
      this.loginSession = token

    }
    console.log("this.loginSessionAfter refresh token get token", this.loginSession)

    var headers = new HttpHeaders({
      // adding login session in api's header
      'Authorization': this.loginSession ? 'Bearer ' + this.loginSession : '',
      'token': '22509F2AE7BA71E4C3FB32AB94B6CEA8',
    })

    let shouldEncrypt: boolean = true;
    let body: any = {};
    if (request.context.get(ENCRYPT_REQUEST)) {
      shouldEncrypt = false;
    }
    if (request.body instanceof FormData) {
      for (let key of request.body.keys()) {
        if (key == 'encrypt') {
          shouldEncrypt = false;
          request.body.delete('encrypt');
          break;
        }
        body[key] = request.body.get(key);
      }
    } else {
      body = request.body;
    }

    // if (shouldEncrypt && this.secureCall && body) {
    //   request.body = body;
    //   request.body = this._CryptoService.encrypt(request.body);
    // }

    console.log("request", request)
    // const requestmod = request.clone({
    //   headers
    // });
    return new Observable(observer => {
      const subscription = next.handle(request)
        .pipe(finalize(() => this.removeRequest(request)))
        .subscribe(
          {
            next: (event) => {
              console.log(event);
              if (event instanceof HttpResponse) {
                console.log(event);
                // const tokenRefresh = event.headers.get('Token-Refresh') ?? event.headers.get('token-refresh');
                // console.log("Should Refresh", tokenRefresh);
                // if (tokenRefresh === 'true' && !this.refreshingToken) {
                //   console.log('🔄 Token refresh header detected...');
                //   this.handleTokenRefresh(request, next, shouldEncrypt).subscribe({
                //     next: (res) => observer.next(res),
                //     error: (err) => observer.error(err),
                //     complete: () => observer.complete()
                //   });
                //   // return; // stop further handling for now
                // }

                // let shouldDecrypt = shouldEncrypt;
                // if (shouldDecrypt && this.secureCall && event.body) {
                //   event = event.clone({
                //     body: this._CryptoService.decrypt(JSON.stringify(event.body))
                //   })
                // }

                if (event.status != 400 && event.status != 401) {
                  observer.next(event);
                } else {
                  this._AuthCoreService.logout();
                  const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.addEventListener('mouseenter', Swal.stopTimer)
                      toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                  })
                  Toast.fire({
                    icon: 'warning',
                    title: 'Session Expired!!'
                  })
                }
                this.removeRequest(request);

              }
            },
            error: (err) => {
              this.removeRequest(request);
              // let shouldDecrypt = shouldEncrypt;
              console.log("err.error", err)

              // if (shouldDecrypt && this.secureCall) {
              //   err['error'] = this._CryptoService.decrypt(JSON.stringify(err['error']))
              // }
              // console.log("err.error", err)
              if (err.error.statuscode == 400 || err.error.statuscode == 401 || err.error.statuscode == 520) {
                this._AuthCoreService.logout(false);
              } else if (err.error.statuscode == 422) {
                if (err?.error?.errors && Object.keys(err.error.errors).length > 0) {
                  for (const key in err.error.errors) {
                    const elementValue = err.error.errors[key];
                    const element = Array.isArray(elementValue) ? elementValue[0] : elementValue;
                    // if (this.form_keys) {
                    //   this.form_keys.get(key)?.setErrors({ 'dynError': element.split('<br')[0] });
                    // }
                    this.toaster.showError(element.split('<br')[0] ?? 'Session Expired!!', 'Error');
                  }
                } else {
                  this.toaster.showError(err, 'Error');
                }
              } else if (err.error.statuscode == 500) {
                this.toaster.showError(err, 'Error');
              } else {
                observer.error(err);
              }
            },
            complete: () => {
              this.removeRequest(request);
              observer.complete();
            }
          }
        );
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(request);

        subscription.unsubscribe();
      };
    });

  }



}
