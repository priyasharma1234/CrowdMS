import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, retry, throwError } from 'rxjs';
import { IApiRequestPayload, IGenericApiResponse } from '../types/global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthCoreService } from './auth-core.service';
import { apiRoutes } from '../config/api-request';
import { NgxToasterService } from '../core/services/toasterNgs.service';




@Injectable({
  providedIn: 'root'
})
export class ApiRequestService {

  constructor(
    private http: HttpClient,
    private _AuthCoreService: AuthCoreService,
    private _NgxToasterService: NgxToasterService
  ) { }

  postData<T, U>(payload: IApiRequestPayload<T>, path: any): Observable<IGenericApiResponse<U>> {
    let headers = new HttpHeaders()
    if (payload?.form) {
      headers = headers.set('from', payload.form);
    }
    if (this._AuthCoreService.token()) {
      console.log('Token found:', this._AuthCoreService.token());
      headers = headers.set('Authorization', `Bearer ${this._AuthCoreService.token()}`);
    }

    return this.http.post<any>(environment.baseUrl + path['url'], payload?.payload ?? payload, { headers })
      .pipe(retry(0), catchError(this.errorHandl));
  };
  getData<T>(path: any, param?: any): Observable<IGenericApiResponse<T>> {
    let headers = new HttpHeaders();

    const token = this._AuthCoreService.token();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const fullUrl = param ? `${environment.baseUrl}${path.url}/${param}` : `${environment.baseUrl}${path.url}`;

    return this.http.get<any>(fullUrl, { headers }).pipe(
      retry(0),
      catchError(this.errorHandl)
    );
  }
  postFormData<T>(formData: FormData, path: any): Observable<T> {
    let headers = new HttpHeaders();
    if (this._AuthCoreService.token()) {
      headers = headers.set('Authorization', `Bearer ${this._AuthCoreService.token()}`);
    }

    return this.http.post<T>(environment.baseUrl + path['url'], formData, { headers }).pipe(
      retry(0),
      catchError(this.errorHandl)
    );
  }
  uploadDocument(file: File, dir: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dir', dir);

    return this.postFormData<{ fileUrl: string }>(formData, apiRoutes.uploadDocument.fileUrl).pipe(
      map((res: any) => {
        if (res?.statuscode === 200 && res?.data?.url) {
          return res.data.url;
        } else {
          const msg = res?.message || 'Upload failed';
          throw new Error(msg);
        }
      }),
      catchError((err) => {
        const errorMsg = err?.error?.message || err?.message || 'Upload failed';
        return throwError(() => new Error(errorMsg));
      })
    );
  }


  errorHandl(err: any) {
    //console.log(err);

    let error: any = '';
    if (err.error instanceof ErrorEvent) {
      error = err.error.message;
    } else {
      error = `Error Code: ${err.status}\nMessage: ${err.message}`;
    }
    return throwError(() => error)
  }

}
