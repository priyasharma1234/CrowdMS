import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AddEntityModalComponent } from './add-entity-modal/add-entity-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-basic-details',
    imports: [CommonModule],
    templateUrl: './basic-details.component.html',
    styleUrl: './basic-details.component.scss'
})
export class BasicDetailsComponent implements OnInit {
    serviceOptions = [
        {
            title: 'Add Depositor',
            description: 'The software vendor or developer who deposits source code physically and related materials into escrow.',
            icon: 'assets/img/add-depositor-icon.svg',
            key: 'depositor'
        },
        {
            title: 'Add Beneficiary',
            description: 'The licensee or client who gains access to the escrowed materials if release conditions are triggered.',
            icon: 'assets/img/house-icon.svg',
            key: 'beneficiary'
        }
    ];
    constructor(private modalService: NgbModal){

    }
    ngOnInit(): void {

    }
    onSelect(serviceKey: string) {
        const modalRef = this.modalService.open(AddEntityModalComponent, {
            centered: true,
            size: 'xl',
        });
        modalRef.componentInstance.entityType = serviceKey;
        modalRef.result.then(
            (result:any) => console.log('Modal result:', result),
            (reason:any) => console.log('Modal dismissed')
        );
    }
}
