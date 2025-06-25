import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

export const exitGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate
): boolean | Observable<boolean> => {
     return component.canDeactivate ? component.canDeactivate() : true;
};