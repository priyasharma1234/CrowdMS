import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class NgxToasterService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message: any, title: any) {
    let toasterConfig = {
    }
    this.toastr.success(message, undefined, toasterConfig);
  }

  showError(message: any, title: any) {
    let toasterConfig = {
      // timeOut: 900000

    }
    this.toastr.error(message, undefined, toasterConfig);
  }

  showInfo(message: any, title: any) {
    let toasterConfig = {
    }
    this.toastr.info(message, undefined, toasterConfig);
  }

  showWarning(message: any, title: any) {
    let toasterConfig = {
    }
    this.toastr.warning(message, undefined, toasterConfig);
  }


}


