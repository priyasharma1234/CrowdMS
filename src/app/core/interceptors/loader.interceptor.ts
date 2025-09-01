import { LoaderService } from './../services/loader.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable(
    { providedIn: 'root' }
)
export class LoaderInterceptor implements HttpInterceptor {

    constructor(public loaderService: LoaderService) {
        //console.log(loaderService);
    }

    // interceptor to handle loader if we will need to handle loader right after the api response
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.showLoader();
        return next.handle(req).pipe(tap({
            next: (event: HttpEvent<any>) =>{
                if(event instanceof HttpResponse) {
                    this.onEnd()
                }
            },error: (err: any) =>{
                this.onEnd()
            }
        }));
    }
    
    private onEnd(): void {
        this.hideLoader();
    }
    private showLoader(): void {
        this.loaderService.show();
    }
    private hideLoader(): void {
        this.loaderService.hide();
    }
}
