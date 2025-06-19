import { Injectable } from '@angular/core';
import {catchError, Observable, retry, throwError} from 'rxjs';
import {IApiRequestPayload, IGenericApiResponse} from '../types/global';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AuthCoreService} from './auth-core.service';




@Injectable({
  providedIn: 'root'
})
export class ApiRequestService {

  constructor(
    private http: HttpClient,
    private _AuthCoreService: AuthCoreService
  ) { }

  postData<T, U>(payload: IApiRequestPayload<T>, path: any): Observable<IGenericApiResponse<U>> {
    let headers = new HttpHeaders()
    if (payload?.form) {
      headers = headers.set('from', payload.form);
    }
    if( this._AuthCoreService.token()) {
      console.log('Token found:', this._AuthCoreService.token());
      headers = headers.set('Authorization', `Bearer ${this._AuthCoreService.token()}`);
    }

    return this.http.post<any>(environment.baseUrl + path['url'], payload?.payload ?? payload, { headers })
      .pipe(retry(0), catchError(this.errorHandl));
  };

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
