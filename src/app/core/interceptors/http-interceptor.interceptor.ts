import { LoaderService } from '@core/services/loader.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'
import { AuthCoreService } from '@page/auth/auth.service';
import { SessionStorageService } from '@core/services/session-storage.service';
import Swal from 'sweetalert2';
import { NgxToasterService } from '@core/services/toasterNgs.service';
import { LocationService } from '@core/services/location.service';
import { CryptoService } from '@core/services/crypto.service';


@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {

  loginSession: string;
  fetchsServiceToken: any;
  latitude: any;
  longitude: any;
  returnData: any;
  form_keys: any;

  secureCall: boolean = false;

  private requests: HttpRequest<any>[] = [];


  constructor(
    private loader: LoaderService,
    private authCoreService: AuthCoreService,
    private sessionStorage: SessionStorageService,
    private toaster: NgxToasterService,
    private locationService: LocationService,
    private crypto: CryptoService
  ) {
    // this.locationService.geterLocation.subscribe({
    //   next: (value: any) => {
    //     this.longitude = value?.long;
    //     this.latitude = value?.lat;
    //   }
    // })
    // let letLang: any = this.locationService.seterLocation.getValue()
    // this.longitude = letLang.long;
    // this.latitude = letLang?.lat;
  }

  removeRequest(req: HttpRequest<any>) {

    // const isLoader: any = req.headers.get('isLoader') == 'true' ? true : false;
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loader.isLoading.next(this.requests.length > 0);
  }

  intercept(request: HttpRequest<any> | any, next: HttpHandler): Observable<HttpEvent<any>> {
    this.secureCall = this.authCoreService.encrypted ?? true;
    this.requests.push(request);

    if (request.headers['lazyUpdate']) {
      this.form_keys = request.headers['lazyUpdate'][0].value;
    }


    if (this.latitude) { }

    // this.loader.show();
    const isCaptchaRequest = request.url === `${environment.userBaseUrl}captcha/generate`;

    if (!isCaptchaRequest) {
      this.loader.isLoading.next(true);
    }

    if (request.url.indexOf(`${environment.corporateBaseUrl}company/list`) > -1) {
      var headers = new HttpHeaders({})
    } else {
      let session: any = ''
      this.loginSession = ''
      session = this.sessionStorage.getItem('userDetails');
      //  console.log("session////////////",session)
      if (session) {
        // console.log("session",session)
        this.loginSession = JSON.parse(session).token; // getting login session to set in headers
        // console.log("JSON.parse(session).token",JSON.parse(session).token)
      }

      var headers = new HttpHeaders({ // adding login session in api's header
        'Authorization': this.loginSession ? 'Bearer ' + this.loginSession : '',
        'token': '22509F2AE7BA71E4C3FB32AB94B6CEA8',
      })

    }
    //  if (request.url.indexOf(`${environment.corporateBaseUrl}kyc/pan-ocr`) > -1) {
    //   var headers = new HttpHeaders({ // adding login session in api's header
    //     'Authorization': 'Bearer' + this.loginSession,
    //     'token': '22509F2AE7BA71E4C3FB32AB94B6CEA8',
    //   })
    // }
    // let shouldEncrypt: boolean = true;
    let body: any = {};
    if (request.body instanceof FormData) {
      // request.clone({
      //   body: request.body.append('latitude', this.latitude)
      // })
      // request.clone({
      //   body: request.body.append('longitude', this.longitude)
      // })
    //   for (let key of request.body.keys()) {
    //     if (key == 'encrypt') {
    //       // shouldEncrypt = false;
    //       request.body.delete('encrypt');
    //       break;
    //     }
    //     body[key] = request.body.get(key);
    //   }
    // } else {
    //   body = request.body;
    // }
    }

    // if (shouldEncrypt && this.secureCall) {
    // if (this.secureCall) {
    //   request.body = body;
    //   // request.body = this.crypto.encrypt(request.body);
    // }
    const requestmod = request.clone({
      headers
    });
    return new Observable(observer => {
      const subscription = next.handle(requestmod).subscribe(
        {
          next: (event) => {
            if (event instanceof HttpResponse) {
              // this.loader.hidden(false);
              // console.log('next');

              // let shouldDecrypt = shouldEncrypt;
              // this.loader.hide();
              // console.log(event.body)
              // if (shouldDecrypt && this.secureCall) {
              //   event = event.clone({
              //     body: this.crypto.decrypt(JSON.stringify(event.body))
              //   })
              // }
              if (event.status !== 400 && event.status !== 401) {
                observer.next(event);
              } else {
                this.authCoreService.logout();
                this.authCoreService.isSessionTimeOut.next(true);
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
            console.log("err11111111111111111111111111htttttppppppp", err);
            this.removeRequest(request);

            // this.loader.hide();
            // console.log(err);
            // let shouldDecrypt = shouldEncrypt;
            // this.loader.hide();
            // if (shouldDecrypt && this.secureCall) {
            //   err['error'] = this.crypto.decrypt(JSON.stringify(err['error']))
            // }
            if (err.error.statuscode == 400 || err.error.statuscode == 401 || err.error.statuscode == 520) {
              this.authCoreService.logout(false);
            } else if (err.error.statuscode == 422) {

              for (const key in err.error.data) {
                const element = err.error.data[key];
                if (this.form_keys) {
                  this.form_keys.get(key)?.setErrors({ 'dynError': element.split('<br')[0] });
                }
                this.toaster.showError(element.split('<br')[0] ?? 'Session Expired!!', 'Error');
              }
            } else if (err.error.statuscode == 500) {
              this.toaster.showError(err.error.message, 'Error');
            } else {
              observer.error(err);
            }
          },
          complete: () => {
            this.removeRequest(request);

            // this.loader.hidden(false);
            // this.loader.hide();
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
