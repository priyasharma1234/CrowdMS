import { CommonModule, NgForOf } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { EditEscrowService } from 'src/app/services/edit-escrow.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
    selector: 'app-view-certificate',
    imports: [CommonModule, PdfViewerModule],
    templateUrl: './view-certificate.component.html',
    styleUrl: './view-certificate.component.scss'
})
export class ViewCertificateComponent {
    @Input() activeTab: string = '';
    certificateUrl: any;
    isPdfFile: boolean = false;
    showViewer: boolean = false;

    constructor(private _EditEscrowService: EditEscrowService,
        private cdRef: ChangeDetectorRef,
        private _FileUploadService: FileUploadService
    ) { }

    async ngOnInit() {
        const cert = this._EditEscrowService.escrowDetails?.certificate_url;
       const escrowId = this._EditEscrowService.escrowDetails?.id
        if (cert) {
            // this.certificateUrl = cert;
            this.isPdfFile = this.isPdf(cert);
            // this._FileUploadService.HandleFileOpen(cert, 'certificate', false, (fileUrl) => {
            //     this.certificateUrl = fileUrl;
            // });
            const url = await this._FileUploadService.HandleFileOpen(Number(escrowId),cert, 'certificate', false);
            if (url) {
                this.certificateUrl = url;
            } this.cdRef.detectChanges();
            setTimeout(() => {
                this.showViewer = true;
            }, 0);
        } else {
            this.certificateUrl = null;
            this.isPdfFile = false;
        }
        // if (cert) {
        //     this.certificateUrl = cert;
        //     this.isPdfFile = this.isPdf(cert);
        //     this.cdRef.detectChanges();
        //     setTimeout(() => {
        //         this.showViewer = true;
        //     }, 0);
        // } else {
        //     this.certificateUrl = null;
        //     this.isPdfFile = false;
        // }
    }
    ngOnChanges() {
        if (this.activeTab === 'pills-certificate') {
            setTimeout(() => {
                this.showViewer = true;
            }, 200);
        } else {
            this.showViewer = false;
        }
    }
    isPdf(url: string | null | undefined): boolean {
        console.log("!!url", !!url);
        console.log("!!url.toLowerCase().endsWith('.pdf')", url?.toLowerCase().endsWith('.pdf'))
        return !!url && url.toLowerCase().endsWith('.pdf');
    }

    ngOnDestroy(): void {
        this.certificateUrl = null;
        this.isPdfFile = false;
    }
}