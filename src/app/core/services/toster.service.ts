import { ToasterIcon } from './../enum/toster-enum';
import { ToasterPosition } from './../enum/toster-enum';

import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { filter, Observable, Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

export class TosterService {

  private subject = new Subject<Alert>();
  private defaultId = 'default-alert';

  toasterConfig: ToasterConfiq = new ToasterConfiq();
   oast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 20000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  
  constructor(private toastr: ToastrService) { }

  presentToast(message, title, type: ToasterType, toasterConfig?: ToasterConfiq | any) {
    // console.log(toasterConfig);
    
    this.toasterConfig = {
      closeButton: true,
      timeOut: toasterConfig?.timeOut,
      easing: toasterConfig?.easing,
      positionClass: toasterConfig?.positionClass,
      icon: toasterConfig?.icon
    }

    // function will call based on toaster type
    switch(type){
      case 'success':
        this.toastr.success(message, title, toasterConfig);
        break;

      case 'error':
        this.toastr.error(message, title, toasterConfig);
        break;

      case 'warning':
        this.toastr.warning(message, title, toasterConfig);
        break;

      case 'info':
        this.toastr.info(message, title, toasterConfig);
        break;

      default:
          this.toastr.warning(message, title, toasterConfig);
          break;
    }
  };

// **************************************************sweet alert code start*******************************************
    // enable subscribing to alerts observable
  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(filter((x) => x && x.id === id));
  };

  // convenience methods
  success(message: string, options?: AlertOption) {
    // this.alert(new Alert({ ...options, type: AlertType.Success, message }));
    Swal.fire({
      toast: true,
      position: 'top-end',
      title: message,
      timer: 5000, //options?.timer,
      timerProgressBar: true, //options?.timer ? true : false,
      icon: 'success',
      showConfirmButton: options?.showConfirmButton,
      showCloseButton: true,
      // showClass: {
      //   popup: 'animate__slideInRight'
      // },
      // hideClass: {
      //   popup: 'animate__slideOutRight'
      // }
    });
  };

  error(message: string, options?: AlertOption) {
    // this.alert(new Alert({ ...options, type: AlertType.Error, message }));
    Swal.fire({
      // title: 'Error!',
      text: message,
      timer: options?.timer,
      timerProgressBar: options?.timer ? true : false,
      icon: 'error',
      showConfirmButton: options?.showConfirmButton,
      showCloseButton: true,
      backdrop: !options?.allowOutsideClick,
      allowOutsideClick: options?.allowOutsideClick || true,
      // showClass: {
      //   backdrop: 'swal2-backdrop-show'
      // },
      // hideClass: {
      //   popup: 'animate__bounceOut'
      // }
    })
    return false;
  };
  errorHtml(message: string, options?: AlertOption) {
    // this.alert(new Alert({ ...options, type: AlertType.Error, message }));
    Swal.fire({
      // title: 'Error!',
      html: message,
      timer: options?.timer,
      timerProgressBar: options?.timer ? true : false,
      icon: 'error',
      showConfirmButton: options?.showConfirmButton,
      showCloseButton: true,
      backdrop: !options?.allowOutsideClick,
      allowOutsideClick: options?.allowOutsideClick || true,
      // showClass: {
      //   backdrop: 'swal2-backdrop-show'
      // },
      // hideClass: {
      //   popup: 'animate__bounceOut'
      // }
    })
    return false;
  };

  info(message: string, options?: AlertOption) {
    //this.alert(new Alert({ ...options, type: AlertType.Info, message }));
    Swal.fire({
      // title: 'Error!',
      text: message,
      timer: options?.timer,
      timerProgressBar: options?.timer ? true : false,
      icon: 'info',
      showConfirmButton: options?.showConfirmButton,
      showCloseButton: true,
      // showClass: {
      //   popup: 'animate__bounceIn'
      // },
      // hideClass: {
      //   popup: 'animate__bounceOut'
      // }
    });
  };
  successalert(message: string, options?: AlertOption) {
    //this.alert(new Alert({ ...options, type: AlertType.Warning, message }));
    Swal.fire({
      // title: 'Error!',
      text: message,
      timer: options?.timer,
      timerProgressBar: options?.timer ? true : false,
      icon: 'success',
      showConfirmButton: options?.showConfirmButton,
      showCloseButton: true
      // showClass: {
      //   popup: 'animate__bounceIn'
      // },
      // hideClass: {
      //   popup: 'animate__bounceOut'
      // }
    })
  };

  warn(message: string, options?: AlertOption) {
    //this.alert(new Alert({ ...options, type: AlertType.Warning, message }));
    Swal.fire({
      // title: 'Error!',
      text: message,
      timer: options?.timer,
      timerProgressBar: options?.timer ? true : false,
      icon: 'warning',
      showConfirmButton: options?.showConfirmButton,
      showCloseButton: true,
      // showClass: {
      //   popup: 'animate__bounceIn'
      // },
      // hideClass: {
      //   popup: 'animate__bounceOut'
      // }
    });
  };

  // main alert method
  alert(alert: Alert) {
    alert.id = alert.id || this.defaultId;
    this.subject.next(alert);
  };

  // clear alerts
  clear(id = this.defaultId) {
    this.subject.next(new Alert({ id }));
  };

  alertwithtml(message: string, options?: AlertOption, callback?:any) {
    Swal.fire({
      title: '<strong>Successful</strong>',
      icon: 'success',
      html: message,
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: 'OK',
      backdrop: !options?.allowOutsideClick,
      allowOutsideClick: options?.allowOutsideClick || true,
    }).then((result) => {
      if (result?.isConfirmed) {
         callback(1)
      }
    });
  };
// **************************************************sweet alert code end***************************************************
  
}

// **************************************************sweet alert classess and interface*******************************************
  export class Alert {
    id?: string;
    type: AlertType = 2;
    message?: string;
    autoClose?: boolean;
    remove:number = 3000;
    keepAfterRouteChange?: boolean;
    fade?: boolean;
    constructor(init?:Partial<Alert>) {
        Object.assign(this, init);
    }
  }

  export enum AlertType {
    Success,
    Error,
    Info,
    Warning
  }

  export interface AlertOption {
    icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
    showConfirmButton?: boolean;
    confirmButtonText?: string;
    timer?: number;
    timerProgressBar?: boolean;
    allowOutsideClick?: boolean;
  }

// **************************************************sweet alert classess and interface*******************************************

// type of toaster 
export type ToasterType = 'success' | 'error' | 'warning' | 'info';

// creating class to initalize the default value of the the toaster config
export class ToasterConfiq{
    closeButton: boolean = true;
    timeOut: number = 200;
    easing: any = 'ease-in ease-out';
    positionClass: ToasterPosition  = ToasterPosition.topRight;
    icon: any = ToasterIcon.success;

    constructor(closeButton?: any, timeOut?: any, easing?: string, positionClass?: any, icon?: ToasterIcon){
      this.closeButton = closeButton;
      this.timeOut = timeOut; 
      this.easing = easing;
      this.positionClass = positionClass;
      this.icon = icon;
    }
}

