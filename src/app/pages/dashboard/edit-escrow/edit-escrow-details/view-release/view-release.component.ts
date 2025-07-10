import { Component } from '@angular/core';
import { ICondition } from './view-release.types';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditEscrowService } from '../../../../../services/edit-escrow.service';
import { ViewEditReleaseComponent } from 'src/app/pages/release/view-edit-release/view-edit-release.component';

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
    releaseDocument: string
    constructor(
        private _ModalService: NgbModal,
        private _EditEscrowService: EditEscrowService
    ) {
        this.releaseDocument = this._EditEscrowService.escrowDetails?.release?.supporting_doc || ''
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
        const modalRef = this._ModalService.open(ViewEditReleaseComponent, {
            size: 'lg'
        })
        modalRef.componentInstance.escrowId = this._EditEscrowService.escrowDetails?.id;
        modalRef.componentInstance.cancelForm.subscribe((result: string) => {
            modalRef.close();
        })
    }
    openInNewTab() {
        if (this.releaseDocument) {
            window.open(this.releaseDocument, '_blank');
        }
    }
}
