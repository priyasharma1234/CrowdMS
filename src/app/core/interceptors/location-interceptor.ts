import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LocationService } from 'src/app/services/location.service';

@Injectable()
export class LocationInterceptor implements HttpInterceptor {

  constructor(private locationService: LocationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ensure location is resolved before sending request
    return from(this.locationService.getLocationFn()).pipe(
      switchMap(location => {
        if (!location) {
          return throwError(() => new Error('Location not available'));
        }
        // const modifiedReq = req.clone({
        //   setHeaders: {
        //     'X-User-Longitude': location.long.toString(),
        //     'X-User-Latitude': location.lat.toString()
        //   }
        // });
        return next.handle(req);
      })
    );
  }
}
