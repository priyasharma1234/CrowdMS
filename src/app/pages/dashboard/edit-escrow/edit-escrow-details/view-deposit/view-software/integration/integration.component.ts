import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { IEscrow } from '../../../../edit-escrow-types';
import { apiRoutes } from 'src/app/config/api-request';

@Component({
    selector: 'app-integration',
    imports: [
        NgIf,
        NgForOf,
        FormsModule
    ],
    templateUrl: './integration.component.html',
    styleUrl: './integration.component.scss',
    standalone: true
})
export class IntegrationComponent implements OnInit {
    integrations = [
        { name: 'GitHub', activated: false, selected: false },
        { name: 'Bitbucket', activated: false, selected: false }
    ];

    @Output() integrationDetails = new EventEmitter<any>();
    @Input() escrow: IEscrow | undefined;
    constructor(
        private _ApiRequestService: ApiRequestService
    ) {

        // Initialization logic if needed

    }

    ngOnInit(): void {
        console.log(this.selectedIntegration);
        this.selectedIntegration = this.selectedIntegration?.toLowerCase();
        switch (this.selectedIntegration) {
            case 'github':
                this.OnIntegrationGithub();
                break;
            case 'Bitbucket':
                this.OnIntegrationBitbucket();
                break;
            default:
                // No integration selected
                this.integrations.forEach(integration => integration.selected = false);
        }
    }





    // Additional methods for handling integration logic can be added here
    @Input() selectedIntegration: string | undefined;
    repositories: any;
    branches: any;
    selectedBranch: any;
    selectedRepository: any;

    private OnIntegrationGithub() {
        this.FetchRepositories();
    }

    private OnIntegrationBitbucket() {

    }

    private FetchRepositories() {
        // this._ApiRequestService.postData<any, any>({ payload: { escrow_id: this.escrow?.id, provider: this.selectedIntegration } }, apiRoutes.escrow.integration_repo).subscribe((res: any) => {
        //     this.repositories = res.repositories;
        // });
    }

    HandleRepoSelect() {
        // this._ApiRequestService.postData<any, any>({ payload: { escrow_id: this.escrow?.id, provider: this.selectedIntegration, repo: this.selectedRepository } }, apiRoutes.escrow.integration_branch).subscribe((res: any) => {
        //     this.branches = res.branches;
        // });
    }

    HandleBranchSelect() {
        this.integrationDetails.emit({
            provider: this.selectedIntegration,
            repo: this.selectedRepository,
            branch: this.selectedBranch
        })
    }
}
