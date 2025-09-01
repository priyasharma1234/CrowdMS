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
  // Additional methods for handling integration logic can be added here
  @Input() selectedIntegration: string | undefined;
  repositories: any;
  branches: any;
  selectedBranch: any;
  selectedRepository: any;
  selectedWorkspace: any;

  protected workspaces: any;
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
      case 'bitbucket':
        this.OnIntegrationBitbucket();
        break;
      default:
        // No integration selected
        this.integrations.forEach(integration => integration.selected = false);
    }
  }





  // Additional methods for handling integration logic can be added here


  protected HandleWorkspaceSelect() {
    this.FetchRepositories();
  }

  private OnIntegrationGithub() {
    this.FetchRepositories();
  }

  private OnIntegrationBitbucket() {
    this.FetchWorkspaces();
  }

  private FetchRepositories() {
    this._ApiRequestService.postData<any, any>({payload: {escrow_id: this.escrow?.id, provider: this.selectedIntegration, workspace: this.selectedWorkspace}}, apiRoutes.escrow.integration_repo).subscribe((res: any) => {
      this.repositories = res.repositories;
    });
  }

  HandleRepoSelect() {
    this._ApiRequestService.postData<any, any>({payload: {escrow_id: this.escrow?.id, provider: this.selectedIntegration, repo: this.selectedRepository, workspace: this.selectedWorkspace}}, apiRoutes.escrow.integration_branch).subscribe((res: any) => {
      this.branches = res.branches;
    });
  }

  HandleBranchSelect() {
    this.integrationDetails.emit({
      provider: this.selectedIntegration,
      repo: this.selectedRepository,
      branch: this.selectedBranch
    })
  }

  private FetchWorkspaces() {
    this._ApiRequestService.postData<any, any>({payload: {escrow_id: this.escrow?.id, provider: this.selectedIntegration}}, apiRoutes.escrow.integration_workspace).subscribe((res: any) => {
      this.workspaces = res.workspaces;
      this.FetchRepositories();
    });
  }
}
