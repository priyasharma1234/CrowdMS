import { CommonModule, NgForOf } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { EditEscrowService } from 'src/app/services/edit-escrow.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-view-certificate',
  imports: [CommonModule,PdfViewerModule],
  templateUrl: './view-certificate.component.html',
  styleUrl: './view-certificate.component.scss'
})
export class ViewCertificateComponent {
   @Input() activeTab: string = '';
    certificateUrl: string | null = null;
    isPdfFile: boolean = false;
    showViewer: boolean = false;

    constructor(private _EditEscrowService: EditEscrowService,
        private cdRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        const cert = this._EditEscrowService.escrowDetails?.certificate_url;

        if (cert) {
            this.certificateUrl = cert;
            this.isPdfFile = this.isPdf(cert);
            this.cdRef.detectChanges();
            setTimeout(() => {
                this.showViewer = true;
            }, 0);
        } else {
            this.certificateUrl = null;
            this.isPdfFile = false;
        }
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