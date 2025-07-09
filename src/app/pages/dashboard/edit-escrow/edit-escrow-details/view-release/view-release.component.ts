import { Component } from '@angular/core';
import {ICondition} from './view-release.types';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddReleaseRequestComponent} from './add-release-request/add-release-request.component';
import {EditEscrowService} from '../../../../../services/edit-escrow.service';

@Component({
  selector: 'app-view-release',
  imports: [
    NgClass,
    NgForOf,
    NgIf
  ],
  templateUrl: './view-release.component.html',
  styleUrl: './view-release.component.scss',
  standalone: true
})
export class ViewReleaseComponent {

  constructor(
    private _ModalService: NgbModal,
    private _EditEscrowService: EditEscrowService
  ) {
    this.conditions = JSON.parse(JSON.parse(this._EditEscrowService.escrowDetails?.release.reason ?? '[]')) as ICondition[];
    console.log('Conditions:', this.conditions);
  }

  conditions: any[] | undefined;

  attachedFileName = '123456.pdf';

  toggleSelection(_label: string): void {
    this.conditions = this.conditions?.map(condition => {
      if (condition.label === _label) {
        return {
          ...condition,
          selected: !condition.selected
        };
      }
      return condition;
    });
  }

  closeModal(): void {
    this._ModalService.dismissAll();
  }
  CreateReleaseRequest(): void {
    const modalRef = this._ModalService.open(AddReleaseRequestComponent, {
      size: 'lg'
    })
    // if (member) {
    //   modalRef.componentInstance.initialData = member;
    // }
    modalRef.componentInstance.cancelForm.subscribe((result: string) => {
      modalRef.close();
    })
  }
}
