
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoLogoutService } from '../service/auto-logout.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auto-log-out',
  templateUrl: './auto-log-out.component.html',
  styleUrls: ['./auto-log-out.component.scss'],
  imports: [ReactiveFormsModule, FormsModule]
})
export class AutoLogOutComponent implements OnInit {
  @ViewChild('content') modalContentRef!: TemplateRef<any>;


  inputForm!: FormGroup;
  idleTimerLeft: string | false = '';
  secondTimerLeft: string = '';
  timeRemain: number = 0;
  FULL_DASH_ARRAY = 283;
  private modalRef!: NgbModalRef | null;
  private subs: Subscription[] = [];

  constructor(
    private _AutoLogoutService: AutoLogoutService,
    private fb: FormBuilder,
    private _Router: Router,
    private modalService: NgbModal

  ) { }

  ngOnInit(): void {
    this.inputForm = this.fb.group({
      firstLevelTimer: ['', Validators.required],
      secondLevelTimer: ['', Validators.required],
    });
    this.initTimer(0.1, 1);
    this.subs.push(
      this._AutoLogoutService.userIdlenessChecker.subscribe(status => this.initiateFirstTimer(status))
    );

    // subscribe to second-level timer updates (either 'SECOND_TIMER_STOPPED' or "min:sec")
    this.subs.push(
      this._AutoLogoutService.secondLevelUserIdleChecker.subscribe(status => this.initiateSecondTimer(status))
    );
  }

  _continue() {
    this.modalRef?.close();
    this._AutoLogoutService.runSecondTimer = false;
    this._AutoLogoutService.initilizeSessionTimeout();
  }

  _logout() {
    this.modalRef?.close();
    this._AutoLogoutService.runTimer = false;
    this._AutoLogoutService.runSecondTimer = false;
    sessionStorage.clear();
    localStorage.clear();
    this._Router.navigateByUrl('/auth/login');
  }

  /**
   * Draw timer circle
   */
  formatTimeLeft = (time: number) => {
    if (time > 0) {
      let seconds = Math.trunc(time / 1000);

      this.setCircleDasharray(seconds);

      let min = 0;
      if (seconds >= 60) {
        min = Math.trunc(seconds / 60);
        //console.log(min);
        seconds -= (min * 60);
      }

      return `${min}:${seconds}`;
    }
    return false;
  }

  setCircleDasharray = (elapsedTime: number) => {
    const inputValue: any = this.inputForm.value;
    const timeLimit = inputValue.firstLevelTimer * 60;

    this.timeRemain = elapsedTime / timeLimit;
    const circleDasharray = `${(
      this.timeRemain * this.FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document.getElementById('base-timer-path-remaining')?.setAttribute('stroke-dasharray', circleDasharray);
  }

  onSubmit(): void {
    if (this.inputForm.invalid) {
      return;
    }

    const inputValue = this.inputForm.value;
    this.initTimer(inputValue.firstLevelTimer, inputValue.secondLevelTimer);
  }

  initTimer(firstTimerValue: number, secondTimerValue: number): void {
    // Timer value initialization
    this._AutoLogoutService.USER_IDLE_TIMER_VALUE_IN_MIN = firstTimerValue;
    this._AutoLogoutService.FINAL_LEVEL_TIMER_VALUE_IN_MIN = secondTimerValue;
    // end

    // Watcher on timer
    this._AutoLogoutService.initilizeSessionTimeout();
    this._AutoLogoutService.userIdlenessChecker.subscribe((status: string) => {
      if (status) {
        this.initiateFirstTimer(status);
      }
    });

    this._AutoLogoutService.secondLevelUserIdleChecker.subscribe((status: string) => {
      if (status) {
        this.initiateSecondTimer(status);
      }
    });
  }

  initiateFirstTimer = (status: string) => {
    switch (status) {
      case 'INITIATE_TIMER':
        break;

      case 'RESET_TIMER':
        break;

      case 'STOPPED_TIMER':
        this.showSendTimerDialog();
        break;

      default:
        this.idleTimerLeft = this.formatTimeLeft(Number(status));
        break;
    }
  }

  initiateSecondTimer = (status: string) => {
    switch (status) {
      case 'INITIATE_SECOND_TIMER':
        break;

      case 'SECOND_TIMER_STARTED':
        break;

      case 'SECOND_TIMER_STOPPED':
        this.logout();
        break;

      default:
        this.secondTimerLeft = status;
        break;
    }
  }

  showSendTimerDialog(): void {
    this.modalRef = this.modalService.open(this.modalContentRef, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'md',
    });
  }

  async continue() {
    this.closeModalIfOpen();
    this._AutoLogoutService.runSecondTimer = false;
    this._AutoLogoutService.initilizeSessionTimeout();

  }

  async logout() {
    this.closeModalIfOpen();
    this._AutoLogoutService.runTimer = false;
    this._AutoLogoutService.runSecondTimer = false;
    sessionStorage.clear();
    localStorage.clear();
    this._Router.navigateByUrl('/auth/login');

  }

  closeModalIfOpen(): void {
    if (this.modalRef) {
      try {
        this.modalRef.close();
      } catch (e) {
      }
      this.modalRef = null;
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.closeModalIfOpen();
  }
}
