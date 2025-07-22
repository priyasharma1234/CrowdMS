import { NgForOf, NgIf } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { AuthCoreService } from 'src/app/services/auth-core.service';
import { EditEscrowService } from 'src/app/services/edit-escrow.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { IntegrationComponent } from './integration/integration.component';
import { apiRoutes } from 'src/app/config/api-request';
import { environment } from 'src/environments/environment';
import { echo } from '../../../../../../services/echo.service';

@Component({
    selector: 'app-view-software',
    imports: [FormsModule,
        NgForOf,
        NgIf,
        IntegrationComponent],
    templateUrl: './view-software.component.html',
    styleUrl: './view-software.component.scss'
})
export class ViewSoftwareComponent {
    depositDetails: any;
    uploadType: any;
    codeUpload: boolean = false;
    uploadedDocuments: { name: string, url: string }[] = [];
    uploadedCertificates: { [key: string]: { name: string, url: string } } = {};
    uploadedSourceCode: { name: string, url: string } = { name: '', url: '' };
    integrationDetails: any;
    @Input() viewMode: boolean = false; // Flag to indicate if the component is in view mode

    constructor(
        private _AuthCoreService: AuthCoreService,
        protected _EditEscrowService: EditEscrowService,
        private _CryptoService: CryptoService,
        private _ApiRequestService: ApiRequestService,
        private _FileUploadService: FileUploadService,
        private _Router: Router
    ) {
    }

    selectedRepo: string = '';
    selectedBranch: string = '';

    selectedIntegration: string = '';
    softwareDeposit: any

    ngOnInit() {
        if (this.viewMode) {
            const escrowDetails = this._EditEscrowService.escrowDetails;
            this.softwareDeposit = this._EditEscrowService.escrowDetails?.software_deposit
            if (escrowDetails?.software_deposit) {
                this.uploadType = escrowDetails.software_deposit[0].upload_type;
                this.codeUpload = !!escrowDetails.software_deposit[0].source_code;
                this.uploadedSourceCode = {
                    name: 'source-code.zip',
                    url: escrowDetails.software_deposit[0].source_code
                };
                this.uploadedDocuments = escrowDetails.software_deposit[0].additional_documents || [];
                this.uploadedCertificates = escrowDetails.software_deposit[0].certificates || {};
                this.integrationDetails = escrowDetails.software_deposit[0].auto_deposit;
                this.version = escrowDetails.software_deposit[0].version;
                console.log(this);
                this.showNext = escrowDetails.stage != 'ACTIVE'
            } else {
                console.warn('No software deposit details found in escrow.');
            }
        }
        // this.FetchCredentials();
        const userid = this._AuthCoreService.user()?.id;
        echo.channel(`oauth.activation.${userid}.${this._EditEscrowService.escrowDetails?.id}`)
            .listen('.Completed', (e: any) => {
                const target = e.integration.toLowerCase();
                this.integrations.update(list =>
                    list.map(integration =>
                        integration.name.toLowerCase() === target
                            ? { ...integration, activated: true, selected: true }
                            : { ...integration, selected: false }
                    )
                );
            });

        this.FetchFlow();
    }

    FetchFlow() {
        // this._ApiRequestService.postData<{ escrow_id: number }, any>({
        //     payload: {
        //         escrow_id: this._EditEscrowService.escrowDetails?.id ?? 0
        //     }
        // }, apiRoutes.escrow.integrationFlow).subscribe(res => this.depositDetails = res.data);


    }

    readonly integrations = signal([
        { name: 'GitHub', logo: 'github', supported: true, activated: false, selected: false },
        { name: '', logo: 'bitbucket', supported: true, activated: false, selected: false },
    ]);
    repositories: any;
    version: any;
    showNext: boolean = true;

    HandleActivate(_integration: string) {
        console.log(this._AuthCoreService.user()?.id);
        const state = { userId: this._AuthCoreService.user()?.id, escrowId: this._EditEscrowService.escrowDetails?.id };
        let encState = this._CryptoService.Encrypt(state);
        encState = encodeURIComponent(encState);
        window.open(environment.baseUrl + '/api/corporate/escrow/github/redirect?state=' + encState, 'blank')
    }

    HandleSelect(_integration: any) {
        if (_integration.activated && !_integration.selected) {
            this.integrations.update(list =>
                list.map(integration => (
                    integration.name == _integration.name ?
                        {
                            ...integration, selected: true
                        } :
                        {
                            ...integration, selected: false
                        }
                ))
            );
            this.selectedIntegration = _integration.name;
        }
    }

    // private FetchCredentials() {
    //     this._ApiRequestService.postData<{ escrow_id: number }, any>({
    //         payload: {
    //             escrow_id: this._EditEscrowService.escrowDetails?.id ?? 0
    //         }
    //     }, apiRoutes.escrow.integrationStatus).subscribe(res => {
    //         if (res.statuscode === 200) {
    //             if (res.data.integration === null) {
    //                 console.warn('No integration credentials found for this escrow.');
    //                 return;
    //             }
    //             this.integrations.update(list =>
    //                 list.map(integration => ({
    //                     ...integration,
    //                     activated: Object.keys(res.data.integration).includes(integration.name.toLowerCase()),
    //                 }))
    //             );
    //         } else {
    //             console.error('Failed to fetch integration credentials:', res.message);
    //         }
    //     });
    // }

    HandleSourceCodeUpload($event: Event) {
        // const input = $event.target as HTMLInputElement;
        // //file must be a zip file
        // if (!input.files || input.files.length === 0) {
        //     console.error('No file selected for upload.');
        //     return;
        // }
        // const file = input.files[0];
        // if (!['application/zip', 'application/x-zip-compressed'].includes(file.type)) {
        //     console.error('Selected file is not a zip file. It is: ', file.type);
        //     return;
        // }

        // const formData = new FormData();
        // formData.append('source_code', file);
        // formData.append('escrow_id', this._EditEscrowService.escrowDetails?.id.toString() ?? '0');
        // this._ApiRequestService.postData({ form: formData }, apiRoutes.escrow.uploadSourceCode)
        //     .subscribe({
        //         next: res => {
        //             this.codeUpload = true;
        //             this.uploadedSourceCode = {
        //                 name: 'source-code.zip',
        //                 url: res.data.source_code_url
        //             };
        //         },
        //         error: err => {
        //             // handle error
        //         }
        //     });
    }

    HandleDocUpload(event: Event) {
        const files = (event.target as HTMLInputElement).files;

        if (!files || files.length === 0) {
            return;
        }

        Array.from(files).forEach((file: File) => {
            this._FileUploadService.uploadDocument(file, 'escrow-documents').subscribe({
                next: (fileUrl: string) => {
                    this.uploadedDocuments.push({
                        name: file.name,
                        url: fileUrl
                    });
                },
                error: (err: Error) => {
                    console.error(`File upload failed for ${file.name}:`, err.message);
                }
            });
        });
    }

    HandleCertUpload($event: Event, cert: string) {
        const input = $event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this._FileUploadService.uploadDocument(file, 'escrow-certificates').subscribe({
                next: (fileUrl: string) => {
                    this.uploadedCertificates[this.CertName(cert)] = {
                        name: file.name,
                        url: fileUrl
                    }
                },
                error: (err: Error) => {
                    console.error(`Certificate upload failed for ${file.name}:`, err.message);
                }
            });
        }
    }

    protected CertName(cert: string) {
        // Remove all non-alphanumeric characters and convert to lowercase
        return cert.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    }



    HandleIntegration($event: any) {
        this.integrationDetails = $event;
    }
      getVerificationKeys(verification: any): string[] {
  return Object.keys(verification || {});
}
}

