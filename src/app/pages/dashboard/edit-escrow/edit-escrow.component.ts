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

  constructor(public _EditEscrowService: EditEscrowService, private _Router: Router) { }
  ngOnInit() {
    console.log(this._EditEscrowService.escrowDetails);
    if (this._EditEscrowService.escrowDetails == undefined) {
      this._Router.navigate(['dashboard']);
      return;
    }
    this._EditEscrowService.currentStep$.pipe(takeUntil(this.destroy$)).subscribe((res: number) => {
      console.log(res);
      const step = this._EditEscrowService.steps.find(x => x.step == res)
      if (step?.route) {
        this._Router.navigate([step.route]);
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly EditEscrowService = EditEscrowService;
}

