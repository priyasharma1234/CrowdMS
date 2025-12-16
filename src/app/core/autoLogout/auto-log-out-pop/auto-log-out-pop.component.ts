import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auto-log-out-pop',
  templateUrl: './auto-log-out-pop.component.html',
  styleUrls: ['./auto-log-out-pop.component.scss']
})
export class AutoLogOutPopComponent implements OnInit {
  @Input() secondTimerLeft$!: Observable<string>;
  secondTimerLeft: string = '';

  constructor(
    public activeModal: NgbActiveModal
  ) {

  }

  ngOnInit(): void {
    if (this.secondTimerLeft$) {
      this.secondTimerLeft$.subscribe((val) => {
        console.log('Countdown value:', val);
        
        this.secondTimerLeft = val;
        // Optional: automatically close modal when countdown reaches 0
        if (this.secondTimerLeft === '0:0') {
          this.activeModal.close('logout');
        }
      });
    }
  }
  _continue() {
    this.activeModal.close('continue');
  }

  _logout() {
    this.activeModal.close('logout');
  }
}
