import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EditEscrowDetailsComponent } from './edit-escrow-details/edit-escrow-details.component';
import { EditEscrowService } from 'src/app/services/edit-escrow.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-escrow',
  imports: [CommonModule, RouterModule, EditEscrowDetailsComponent],
  templateUrl: './edit-escrow.component.html',
  styleUrl: './edit-escrow.component.scss'
})
export class EditEscrowComponent implements OnInit {
  private destroy$ = new Subject<void>();
  status: boolean = false;

  constructor(public _EditEscrowService: EditEscrowService, private _Router: Router) { }
  ngOnInit() {
    console.log(this._EditEscrowService.escrowDetails);
    if (this._EditEscrowService.escrowDetails == undefined) {
      this._Router.navigate(['dashboard']);
      return;
    }
    //  let escrowDetails = this._EditEscrowService.escrowDetails;
      this._EditEscrowService.escrowDetails$?.pipe(takeUntil(this.destroy$)).subscribe((escrowDetails) => {
      if (escrowDetails.stage == 'ACTIVE') this.status = escrowDetails?.release_request?.some(item => item.status == 2);
    })
    // this.status = escrowDetails.stage === 'ACTIVE' && this._EditEscrowService.escrowDetails?.release_request?.some(item => item.status === 2);
    if (this._EditEscrowService.escrowDetails?.stage == 'ACTIVE') {
      this._EditEscrowService.currentStep = this.status ? 5 : 4;
    } else if (this._EditEscrowService.escrowDetails?.stage == 'RELEASE') {
      this._EditEscrowService.currentStep = 5;
    } else if (this._EditEscrowService.escrowDetails?.stage == 'EXIT') {
      this._EditEscrowService.currentStep = 6;
    }
    // this._EditEscrowService.currentStep$.pipe(takeUntil(this.destroy$)).subscribe((res: number) => {
    //   console.log(res);
    //   const step = this._EditEscrowService.steps.find(x => x.step == res)
    //   if (step?.route) {
    //     this._Router.navigate([step.route]);
    //   }
    // })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly EditEscrowService = EditEscrowService;
}

