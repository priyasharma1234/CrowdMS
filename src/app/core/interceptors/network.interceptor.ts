import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable(
    { providedIn: 'root' }
)
export class NetworkInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(tap(
            (event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                if (!window.navigator.onLine) {
                    // this.router.navigate(['/no-internet'], {queryParams: {'navigateFrom': window.location.pathname}});
                    this.router.navigate(['/no-internet']);
                    return;
                }
            }
        }, (err: any) => {
            if (!window.navigator.onLine) {
                this.router.navigate(['/no-internet']);
                //console.log("offline ",window.location.pathname)
                return;
            } 
            //console.log("offline ",window.location.pathname)
        }));
    }
}
