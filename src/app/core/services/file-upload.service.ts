import { ApiRequestService } from '@core/services/api-request.service';
import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from './session-storage.service';
@Injectable(
  {
    providedIn: 'root'
  }
)
export class FileuploadService {
  HttpUploadOptions = {
    headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
  }
  endpoint = environment.imgBaseUrl;
  imgToken = environment.imgBaseToken;
  // endpoint = 'https://py.rnfi.in/backend/public/getfilelink';
  constructor(
    private http: HttpClient,
    private sessionStorage: SessionStorageService,

  ) {
    // console.log(" -------upload file service -----------")
  }


  uploadFileFn(file: any, unlinkurl?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const formdata = new FormData();
      formdata.append('token', this.imgToken);
      // formdata.append('token', 'cGFua2FqcmV0YWlsZXIxLzIzLzE2NTA0MzgxNDk=');
      formdata.append('image', file);
      formdata.append('encrypt', 'false');
      if (!isDevMode() && unlinkurl) {
        formdata.append('unlink', unlinkurl);
      }


      this.http.post(this.endpoint, formdata, this.HttpUploadOptions)
        .subscribe((res: any) => {
          resolve(res);
        });

    })
  }

  asyncMethod(url: any) {
    // return new Promise((resolve, reject) => {
// console.log(url);

      let session: any = ''
      let loginSession = ''
      session = this.sessionStorage.getItem('userDetails');
      // console.log(session)
      if (session) {
        loginSession = JSON.parse(session).token; // getting login session to set in headers
      }

      var headers = new HttpHeaders({ // adding login session in api's header
        'Authorization': loginSession ? 'Bearer' + loginSession : '',
        'token': '22509F2AE7BA71E4C3FB32AB94B6CEA8',
      })

      const formdata = new FormData();

      return this.http.post(environment.corporateBaseUrl+url.url,null, { headers })

    // })
  }
}

