import { Injectable } from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import {apiRoutes} from '../config/api-request';
import {ApiRequestService} from './api-request.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private _ApiRequestService: ApiRequestService
  ) { }

  uploadDocument(file: File, dir: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dir', dir);

    return this._ApiRequestService.postFormData<{ fileUrl: string }>(formData, apiRoutes.uploadDocument.fileUrl).pipe(
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
}
