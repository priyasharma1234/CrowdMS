import { inject, Injectable, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, map, Observable, Subject, takeUntil, takeWhile } from 'rxjs';
import { AutoLogOutPopComponent } from '../auto-log-out-pop/auto-log-out-pop.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { AuthCoreService } from '../../../services/auth-core.service';
import _ from 'lodash';
const STORE_KEY = 'userLastAction';
const LOGOUT_EVENT = 'crossTabLogout';

@Injectable({ providedIn: 'root' }
)
export class AutoLogoutService {
  runTimer = false;
  runSecondTimer = false;
  USER_IDLE_TIMER_VALUE_IN_MIN = 1;
  FINAL_LEVEL_TIMER_VALUE_IN_MIN = 1;

  private isPaused = false;
  private activeApiRequests = 0;

  userIdlenessChecker: BehaviorSubject<string> = new BehaviorSubject<string>('INITIATE_TIMER');
  secondLevelUserIdleChecker: BehaviorSubject<string> = new BehaviorSubject<string>('INITIATE_SECOND_TIMER');
  secondTimerLeftFn: BehaviorSubject<any> = new BehaviorSubject<any>('');

  private destroy$ = new Subject<void>();
  private userActivityCallback!: (event: Event) => void;
  private dialogRef!: NgbModalRef;
  private sessionCheck$?: Observable<number>;
  private finalCheck$?: Observable<number>;
  private finalEndTime = 0;

  private sessionForIdle!: Observable<number>;
  public clockForIdle!: Observable<number>;
  private injector = inject(Injector);

  constructor(
    private zone: NgZone,
    private _Router: Router,
    private dialog: NgbModal
  ) {
    this.initUserIdlenessWatcher();
    this.initSecondLevelWatcher();

    // Optional: listen for storage changes across tabs
    window.addEventListener('storage', (event) => {
      if (event.key === LOGOUT_EVENT && event.newValue === 'true') {
        this.zone.run(() => this.clearSession(false));
      }
    });

    // Ensure timer is rechecked immediately when tab becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.zone.run(() => this.recheckIdleImmediately());
      }
    });

  }

  // pause inactivity timer
  public pauseInactivity(): void {
    this.isPaused = true;
    this.runTimer = false;
    this.runSecondTimer = false;

    this.removeUserActivityListener();
  }

  // resume inactivity timer
  public resumeInactivity(): void {
    this.isPaused = false;
    this.initilizeSessionTimeout();
  }

  // /** Watcher for first timer */
  private initUserIdlenessWatcher(): void {
    this.userIdlenessChecker.pipe(takeUntil(this.destroy$)).subscribe(status => {
      // if (status === 'STOPPED_TIMER') {
      //   this.showAutoLogoutModal();
      // }

      if (status === 'STOPPED_TIMER' && !this.isPaused) {
        this.showAutoLogoutModal();
      }
    });
  }

  // /** Watcher for second timer */
  private initSecondLevelWatcher(): void {
    this.secondLevelUserIdleChecker.pipe(takeUntil(this.destroy$)).subscribe(status => {
      if (status === 'SECOND_TIMER_STOPPED' && !this.isPaused) {
        this.dialogRef?.close();
        this.logout();
      } else {
        this.secondTimerLeftFn.next(status);
      }
    });
  }

  /** Show warning modal before auto-logout */
  private showAutoLogoutModal(): void {
    if (this.isPaused) return;
    this.dialogRef = this.dialog.open(AutoLogOutPopComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    const instance = this.dialogRef.componentInstance as AutoLogOutPopComponent;
    instance.secondTimerLeft$ = this.secondTimerLeftFn.asObservable();

    this.dialogRef.closed.subscribe((result: 'continue' | 'logout') => {
      if (result === 'continue') {
        this.runSecondTimer = false;
        this.initilizeSessionTimeout();
      } else {
        this.clearSession();
      }
    });
  }

  /** Initialize idle session timer */
  public initilizeSessionTimeout(): void {
    if (this.isPaused) return;

    if (!this.USER_IDLE_TIMER_VALUE_IN_MIN || this.USER_IDLE_TIMER_VALUE_IN_MIN <= 0) {
      throw new Error('Please provide a valid USER_IDLE_TIMER_VALUE_IN_MIN');
    }
    this.runTimer = true;
    this.reset();
    this.listenUserActivity();
    this.startIdleCheckInterval();
    // this.initInterval();
  }

  formatTimeLeft = (time: number) => {
    if (time > 0) {
      let seconds = Math.trunc(time / 1000);
      let min = 0;
      if (seconds >= 60) {
        min = Math.trunc(seconds / 60);
        seconds -= (min * 60);
      }

      return `${min}:${seconds}`;
    }
    return false;
  }

  /** Init */
  public init(): void {
    this.FINAL_LEVEL_TIMER_VALUE_IN_MIN = environment.autoLogoutTimer || 1;
    this.initilizeSessionTimeout();
  }

  uninit() {
    this.runTimer = false;
    this.runSecondTimer = false;
    this.destroy$.next();
  }

  public removeActionFromStore(): void {
    localStorage.removeItem(STORE_KEY);
  }

  /** Start periodic idle check */
  private startIdleCheckInterval(): void {
    const intervalDuration = 1000; // check every second
    this.sessionCheck$ = interval(intervalDuration).pipe(takeWhile(() => this.runTimer));
    this.checkIdleState();

  }

  /** Continuously check user idle time (even if tab inactive) */
  private checkIdleState(): void {
    this.sessionCheck$?.subscribe(() => {
      if (this.isPaused) return;
      const now = Date.now();
      const elapsed = now - this.lastAction;
      const maxIdleTime = this.USER_IDLE_TIMER_VALUE_IN_MIN * 60 * 1000;

      if (elapsed >= maxIdleTime) {
        this.removeUserActivityListener();
        this.zone.run(() => {
          if (!this.isPaused) {
            this.userIdlenessChecker.next('STOPPED_TIMER');

            if (this.FINAL_LEVEL_TIMER_VALUE_IN_MIN > 0) {
              // this.secondLevelUserIdleChecker.next('SECOND_TIMER_STARTED');
              this.secondLevelUserIdleChecker.next('');
              this.startFinalCountdown();
            }
          }

          this.runTimer = false;
        });
      }
    });
  }

  /** Final countdown timer (based on absolute time, not tick count) */
  private startFinalCountdown(): void {
    if (this.isPaused) return;

    this.runSecondTimer = true;
    const totalMillis = this.FINAL_LEVEL_TIMER_VALUE_IN_MIN * 60 * 1000;
    const startTime = Date.now();
    this.finalEndTime = startTime + totalMillis;
    const remaining = this.finalEndTime - Date.now();
    let remainingSeconds = this.FINAL_LEVEL_TIMER_VALUE_IN_MIN * 60;
    this.finalCheck$ = interval(1000).pipe(takeWhile(() => this.runSecondTimer));
    this.finalCheck$.subscribe(() => {
      if (this.isPaused) return;

      if (remainingSeconds <= 0) {
        this.runSecondTimer = false;
        this.secondLevelUserIdleChecker.next('SECOND_TIMER_STOPPED');
      } else {
        // const mins = Math.floor(remaining / 60000);
        // const secs = Math.floor((remaining % 60000) / 1000);
        // this.secondLevelUserIdleChecker.next(`${mins}:${secs < 10 ? '0' : ''}${secs}`);

        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        this.secondLevelUserIdleChecker.next(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        remainingSeconds--;
      }
    });
  }

  /** Immediate recheck when tab becomes visible */
  private recheckIdleImmediately(): void {
    if (this.isPaused) return;

    const now = Date.now();
    const elapsed = now - this.lastAction;
    const maxIdleTime = this.USER_IDLE_TIMER_VALUE_IN_MIN * 60 * 1000;

    if (elapsed >= maxIdleTime && this.runTimer) {
      this.userIdlenessChecker.next('STOPPED_TIMER');
      this.runTimer = false;
    }

    if (this.runSecondTimer && now >= this.finalEndTime) {
      this.secondLevelUserIdleChecker.next('SECOND_TIMER_STOPPED');
    }
  }

  private initInterval(): void {
    const intervalDuration = 1000;
    this.sessionForIdle = interval(intervalDuration).pipe(
      map((tick: number) => {
        return tick;
      }),
      takeWhile(() => this.runTimer)
    );

    this.check();
  }

  private check(): void {
    this.sessionForIdle.subscribe(() => {
      const now = Date.now();
      const timeleft = this.lastAction + this.USER_IDLE_TIMER_VALUE_IN_MIN * 60 * 1000;
      const diff = timeleft - now;
      const isTimeout = diff < 0;

      this.userIdlenessChecker.next(`${diff}`);

      if (isTimeout) {
        window.document.removeEventListener('click', this.userActivityCallback, true);
        this.zone.run(() => {
          if (this.userIdlenessChecker) {
            this.userIdlenessChecker.next('STOPPED_TIMER');

            if (this.FINAL_LEVEL_TIMER_VALUE_IN_MIN > 0) {
              this.secondLevelUserIdleChecker.next('SECOND_TIMER_STARTED');
              this.executeFinalTimer();
            }
          }
          this.runTimer = false;
        });
      }
    });
  }

  private executeFinalTimer = () => {
    this.runSecondTimer = true;
    this.initializeFinalTimer();
  }

  private initializeFinalTimer(): void {
    const intervalDuration = 1000;
    this.clockForIdle = interval(intervalDuration).pipe(
      map((tick: number) => {
        return tick;
      }),
      takeWhile(() => this.runSecondTimer)
    );

    this.checkUserActionTime();
  }

  private checkUserActionTime(): void {
    let timeInSecond = 60;
    let timeInMin = this.FINAL_LEVEL_TIMER_VALUE_IN_MIN - 1;
    this.clockForIdle.subscribe(() => {
      if (--timeInSecond === 0) {
        if (--timeInMin === 0) {
          timeInMin = (timeInMin > 0) ? (timeInMin - 1) : 0;
        }
        if (timeInMin === -1 && timeInSecond === 0) {
          this.runSecondTimer = false;

          if (this.secondLevelUserIdleChecker) {
            this.secondLevelUserIdleChecker.next('SECOND_TIMER_STOPPED');
          }
        }
        if (timeInMin < 0) {
          timeInMin = 0;
          setTimeout(() => {
            timeInSecond = 60;
          }, 800);
        } else {
          timeInSecond = 60;
        }
      }

      this.secondLevelUserIdleChecker.next(`${timeInMin}:${timeInSecond}`);
    });
  }

  /** Activity listener */
  private listenUserActivity(): void {
    this.zone.runOutsideAngular(() => {
      this.userActivityCallback = () => this.reset();
      const events = [
        'click', 'dblclick', 'mousedown', 'mouseup', 'contextmenu',
        'mouseout', 'mousewheel', 'mouseover', 'touchstart', 'touchend',
        'touchmove', 'touchcancel', 'keydown', 'keyup', 'keypress',
        'focus', 'blur', 'change', 'submit', 'resize', 'scroll', 'load', 'unload', 'hashchange'
      ];
      events.forEach(ev => window.document.addEventListener(ev, this.userActivityCallback, true));
    });
  }

  /** Remove listeners */
  private removeUserActivityListener(): void {
    if (this.userActivityCallback) {
      const events = [
        'click', 'dblclick', 'mousedown', 'mouseup', 'contextmenu',
        'mouseout', 'mousewheel', 'mouseover', 'touchstart', 'touchend',
        'touchmove', 'touchcancel', 'keydown', 'keyup', 'keypress',
        'resize', 'scroll', 'change', 'submit', 'focus', 'blur'
      ];
      events.forEach(ev => window.document.removeEventListener(ev, this.userActivityCallback, true));
    }
  }

  /** Resets idle timer */
  public reset(): void {
    if (this.isPaused) return;
    this.lastAction = Date.now();
    if (this.userIdlenessChecker) {
      this.userIdlenessChecker.next('RESET_TIMER');
    }
  }

  /** LocalStorage accessors */
  get lastAction(): number {
    return parseInt(localStorage.getItem(STORE_KEY) ?? '0', 10);
  }

  set lastAction(value: number) {
    localStorage.setItem(STORE_KEY, value.toString());
  }

  /** Clear everything and logout */
  private clearSession(broadcast = true): void {
    const _AuthCoreService = this.injector.get(AuthCoreService);
    _AuthCoreService.user.set(null);
    _AuthCoreService.isAuthenticated.set(false);
    _AuthCoreService.token.set(null);
    this.runTimer = false;
    this.runSecondTimer = false;

    this.dialog.dismissAll();
    try { Swal.close(); } catch { }
    sessionStorage.clear();
    localStorage.clear();

    if (broadcast) {
      localStorage.setItem(LOGOUT_EVENT, 'true');
    }

    this._Router.navigate(['/auth/login']);
  }

  logout(): void {
    this.clearSession();
    this.removeUserActivityListener();
  }



  public notifyApiStart() {
    this.activeApiRequests++;
    if (this.activeApiRequests === 1) {
      this.pauseInactivity();
    }
  }

  public notifyApiEnd() {
    this.activeApiRequests--;
    if (this.activeApiRequests <= 0) {
      this.activeApiRequests = 0;
      this.resumeInactivity();
    }
  }

  /** Cleanup */
  ngOnDestroy(): void {
    // this.uninit();
    this.destroy$.next();
    this.dialog.dismissAll();
  }

}
