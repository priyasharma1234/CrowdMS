import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ngx-toastr';
import { HttpInterceptorInterceptor } from './core/interceptors/http-interceptor.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), DatePipe, provideAnimations(), provideRouter(routes),  {
      provide: BsDatepickerConfig,
      useValue: {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
      } as Partial<BsDatepickerConfig>
    },
      importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        autoDismiss: false, maxOpened: 1, preventDuplicates: true,
        positionClass: 'toast-bottom-center', closeButton: true,
      }),
    ), provideHttpClient(withInterceptorsFromDi()),
   {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorInterceptor,
      multi: true
    },]
};
