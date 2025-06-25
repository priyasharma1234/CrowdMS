import { environment } from 'src/environments/environment';
import { catchError, firstValueFrom, Observable, retry, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiRequestService {

  constructor(private http: HttpClient) {
  }

  // function to perform post operation using formData type payload and header
  postData(payload: any, path: any): Observable<any> {
    let headers = new HttpHeaders()
    if (payload?.form) {
      headers = headers.set('from', payload.form);
    }

    return this.http.post<any>(environment.userBaseUrl + path['url'], payload?.payload ?? payload, { headers })
      .pipe(retry(0), catchError(this.errorHandl));
  };
  postFormData(formData: FormData, path: any): Observable<any> {
    let headers = new HttpHeaders();
    console.log("headers", headers);
    formData.forEach((value, key) => {
      console.log('✅ FormData contains:', key, value);
    });
    return this.http.post<any>(
      environment.userBaseUrl + path['url'],
      formData,
    ).pipe(
      retry(0),
      catchError(this.errorHandl)
    );
  }

  

  getData(path: any): Observable<any> {
    return this.http.get<any>(environment.userBaseUrl + path['url'])
      .pipe(retry(0), catchError(this.errorHandl));
  }

  postDataUser(payload: any, path: any): Observable<any> {
    let headers = new HttpHeaders()
    if (payload?.form) {
      headers = headers.set('from', payload.form);
    }

    return this.http.post<any>(environment.userBaseUrl + path['url'], payload?.payload ?? payload, { headers })
      .pipe(retry(0), catchError(this.errorHandl));
  };


  // Function for get Api

  // function to perform post operation using formData type payload and with no header
  postDataWithoutHeader(payload: any, path: any): Observable<any> {
    let headers = new HttpHeaders()
    if (payload?.form) {
      headers = headers.set('from', payload.form);
    }
    return this.http.post<any>(environment.userBaseUrl + path['url'], payload?.payload ?? payload, { headers })
      .pipe(retry(0), catchError(this.errorHandl));
  };


  async postDataAsync(payload: any, path: any): Promise<any> {
    let headers = new HttpHeaders();
    if (payload?.form) {
      headers = headers.set('from', payload.form);
    }

    try {
      const response = await firstValueFrom(this.http.post<any>(environment.userBaseUrl + path['url'], payload?.payload ?? payload, { headers })
        .pipe(retry(0), catchError(this.errorHandl)));
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  async postDataUserAsync(payload: any, path: any): Promise<any> {
    try {
      const response = await firstValueFrom(this.http.post<any>(environment.userBaseUrl + path['url'], payload)
        .pipe(retry(0), catchError(this.errorHandl)));
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  async postDataReportingAsync(payload: any, path: any): Promise<any> {
    try {
      const response = await firstValueFrom(this.http
        .post<any>(environment.reportingBaseUrl + path['url'], payload)
        .pipe(retry(0), catchError(this.errorHandl)));
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  async postDataWithoutHeaderAsync(payload: any, path: any): Promise<any> {
    let headers = new HttpHeaders();
    if (payload?.form) {
      headers = headers.set('from', payload.form);
    }

    try {
      const response = await firstValueFrom(this.http
        .post<any>(environment.corporateBaseUrl + path['url'], payload?.payload ?? payload, { headers })
        .pipe(retry(0), catchError(this.errorHandl)));
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  uploadFile(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(environment.userBaseUrl, payload)
        .subscribe((res: any) => {
          resolve(res);
        });

    })
  }

  async fileUpload(file: any, oldFile?: any) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('token', environment.imgBaseToken);
    if (oldFile) formData.append('unlink', oldFile);
    console.log(oldFile, file);

    // check if file is pdf or image
    if (file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/png') {
      let res = await this.uploadFile(formData);
      if (res.statuscode == 200) {
        return res.pan_proof;
      }
    } else return false;

  }

  // handling error
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
