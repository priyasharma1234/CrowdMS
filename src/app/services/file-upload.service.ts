import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, Observable, throwError } from 'rxjs';
import { apiRoutes } from '../config/api-request';
import { ApiRequestService } from './api-request.service';

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
 async HandleFileOpen(_escrowId: number | '', _documentPath: any, _fileType: string, _openDoc = true) {
    console.log("_escrowId", _escrowId);
    console.log("_documentPath", _documentPath);
    console.log("_fileType", _fileType);
      const payload = {
      payload: {
        escrow_id: _escrowId,
        document_path: _documentPath,
      },
    };

     try {
      const response: any = await firstValueFrom(this._ApiRequestService.postData(payload, apiRoutes.uploadDocument.getToken));

      const token = response?.data?.token;
      if (!token) {
        return;
      }

      const fileUrl = `${_documentPath}&token=${token}&type=${_fileType}`;

      if (_openDoc) {
        return window.open(fileUrl, '_blank');
      } else {
        return fileUrl;
      }

    } catch (error) {
      console.error('Error fetching document token:', error);
      throw error;
    }
  }
  }
