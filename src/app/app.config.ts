import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ngx-toastr';
import { HttpInterceptorInterceptor } from './core/interceptors/http-interceptor.interceptor';
import { AuthCoreService } from './services/auth-core.service';
import { ApiRequestService } from './services/api-request.service';
import { firstValueFrom } from 'rxjs';
import { apiRoutes } from './config/api-request';
import { LocationInterceptor } from './core/interceptors/location-interceptor';
export function initApp() {
  return async () => {
    const apiRequestService = inject(ApiRequestService);
    const authCoreService = inject(AuthCoreService);

    try {
      const res: any = await firstValueFrom(apiRequestService.postDataWithoutBase({},'https://api_uat.sprintexcode.in/should-encrypt'));

      if (res?.statuscode == 200) {
        console.log('API Encryption Status:', res.data);
        authCoreService.encrypted.set(!!res.data.encrypt);
      }
    } catch (err) {
      console.error('APP_INITIALIZER failed:', err);
    }
  };
}
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
     provideAppInitializer(initApp())
   ,{
      provide: HTTP_INTERCEPTORS,
      useClass: LocationInterceptor,
      multi: true,
    },{
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorInterceptor,
      multi: true
    }
   ]
};
