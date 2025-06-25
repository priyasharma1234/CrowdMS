import { Injectable } from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  constructor(private _Router: Router) { }
  checkFormControlAvailable(formGroup: FormGroup, controlName: string) {
    return Object.keys(formGroup.controls).find((name: any) => {
      return formGroup.get(controlName) === formGroup.controls[name];
    });
    // Object.keys(formGroup).find(name => formGroup.get(controlName) === formGroup[name]
  }
  setRemoveValidator(
    type: 'r' | 'a', //'r' remove | 'a' add
    group: FormGroup,
    control: string | string[],
    validators: ValidatorFn | ValidatorFn[],
    checkHasInForm: boolean = false
  ) {
    let controls: string[] = typeof control === 'string' ? (control === 'all' ? Object.keys(group.value)
      : [control]) : control;
    controls.forEach((controlName) => {
      if (
        checkHasInForm &&
        !this.checkFormControlAvailable(group, controlName)
      ) {
        return;
      }
      if (type === 'a') {
        group.controls[controlName].addValidators(validators);
      } else if (type === 'r') {
        group.controls[controlName].removeValidators(validators);
      }
      group.controls[controlName].updateValueAndValidity();
    });
  }

  reloadTo(uri: string) {
    this._Router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this._Router.navigate([uri ?? '**']));
  }
  // generatePDF(
  //   _invoiceElement: any,
  //   filename: any,
  //   isType: 'PRINT' | 'DOWNLOAD' = 'DOWNLOAD',
  //   customPage?: boolean
  // ): void {
  //   let invoiceElement: any = { _invoiceElement };
  //   invoiceElement = invoiceElement._invoiceElement;
  //   html2canvas(invoiceElement, {
  //     scale: 3, onclone(document: Document, element: HTMLElement) {
  //       element.querySelector('.receiptStampBox')?.classList.remove('d-none')
  //     },
  //   }).then((canvas) => {
  //     // console.log(canvas);

  //     const imageGeneratedFromTemplate = canvas.toDataURL('image/png');

  //     const fileWidth = 200;
  //     const generatedImageHeight = (canvas.height * fileWidth) / canvas.width;
  //     let page: any = 'a4'
  //     if (customPage) {
  //       page = [fileWidth + 20, generatedImageHeight]
  //     }
  //     let PDF = new jsPDF('p', 'mm', page);
  //     PDF.addImage(
  //       imageGeneratedFromTemplate,
  //       'PNG',
  //       5,
  //       5,
  //       fileWidth,
  //       generatedImageHeight,
  //       '',
  //       'MEDIUM'
  //     );
  //     PDF.rect(
  //       5,
  //       5,
  //       PDF.internal.pageSize.width - 10,
  //       PDF.internal.pageSize.height - 10,
  //       'S'
  //     );
  //     // invoiceElement.querySelector('.receiptStampBox')?.classList.remove('d-none');
  //     // console.log(invoiceElement.querySelector('.receiptStampBox'));

  //     PDF.html(invoiceElement.innerHTML);
  //     if (isType == 'DOWNLOAD') {
  //       PDF.save(`${filename}.pdf`);
  //     } else if (isType == 'PRINT') {
  //       PDF.autoPrint();
  //       window.open(PDF.output('bloburl'), '_blank');
  //     }
  //   });
  // }

  generatePDF(
    _invoiceElement: any,
    filename: any,
    isType: 'PRINT' | 'DOWNLOAD' = 'DOWNLOAD',
    customPage?: boolean,
    isFooter: boolean = false
  ): void {
    let invoiceElement: any = { _invoiceElement };
    invoiceElement = invoiceElement._invoiceElement;

    html2canvas(invoiceElement, {
      scale: 3,
      onclone(document: Document, element: HTMLElement) {
        // console.log("element",element);
        // element.querySelector('.receiptStampBox')?.classList.remove('d-none');
        element.querySelector('.fd-modal-head')?.classList.remove('d-none');
      },
    }).then((canvas) => {
      const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
      const fileWidth = 200;
      const generatedImageHeight =
        (canvas.height * fileWidth) / canvas.width;

      let page: any = 'a4';
      if (customPage) {
        page = [fileWidth + 20, generatedImageHeight];
      }

      const PDF = new jsPDF('p', 'mm', page);
      const pageWidth = PDF.internal.pageSize.width;
      const pageHeight = PDF.internal.pageSize.height;
      const margin = 5;
      const maxContentHeight = pageHeight - 2 * margin - 10;
      let yOffset = margin;
      // Add Invoice Content as Image
      const rectBottomHeight = 5;
      // if (isFooter) {
      //    PDF.addImage(imageGeneratedFromTemplate,'PNG',margin,yOffset,fileWidth,maxContentHeight,'','MEDIUM');
      // } else{
      // PDF.addImage(imageGeneratedFromTemplate,'PNG',5,5,fileWidth,generatedImageHeight,'','MEDIUM');
      // }
    PDF.addImage(imageGeneratedFromTemplate,'PNG',5,5,fileWidth,generatedImageHeight,'','MEDIUM');
      PDF.rect(margin, rectBottomHeight, pageWidth - 2 * margin, pageHeight - 2 * margin, 'S');
      // PDF.rect(5,rectBottomHeight,PDF.internal.pageSize.width - 10, PDF.internal.pageSize.height - 10,'S');
      if (isFooter) {
      // Add Footer
      const footerHeight = 20; // Footer height
      const footerYStart = pageHeight - footerHeight-rectBottomHeight;
      PDF.setFillColor(1, 82, 137); // RGB color for background (dark blue)
      PDF.setDrawColor(0, 0, 0); // Border color (black)
      PDF.roundedRect(5, footerYStart, pageWidth - 10, footerHeight,2, 6, 'FD'); // Draw rectangle for footer border
      const footerLinks = [
        { label: 'Contact Us', url: 'https://shivalikbank.com/contact-us' },
        { label: 'Terms and Conditions', url: 'https://shivalikbank.com/regulatory-section/terms-and-conditions/internet-banking' },
        { label: 'Privacy Policy', url: 'https://shivalikbank.com/regulatory-section/privacy-policy' },
        { label: 'Disclaimer', url: 'https://shivalikbank.com/regulatory-section/disclaimer' },
        { label: 'Regulatory Policy', url: 'https://shivalikbank.com/regulatory-section' },
        { label: 'Banking Ombudsman', url: 'https://shivalikbank.com/regulatory-section/notice-board/banking-ombudsman' },
        { label: 'RBI Financial Literacy Week', url: 'https://shivalikbank.com/rbi-financial-literacy-week-2024' },
      ];

      const footerLinksXStart = 10;
      const footerLinksY = footerYStart + 4;
      PDF.setTextColor(255, 255, 255);
      PDF.setFontSize(10);
      const lineHeight = 6; // Space between lines of text
      let currentX = footerLinksXStart;
      let currentY = footerLinksY;
      const maxWidth = pageWidth / 2;

      footerLinks.forEach((link) => {
        const linkWidth = PDF.getTextWidth(link.label);

        // If the text width exceeds the available width, break it into new lines
        if (currentX + linkWidth > maxWidth) {
          // Move to next line if the current line is full
          currentY += lineHeight;
          currentX = footerLinksXStart;
        }
        PDF.setDrawColor(0, 0, 0); // Blue color for the underline
        PDF.setLineWidth(0.9); // Thickness of the line
        PDF.textWithLink(link.label, currentX, currentY, { url: link.url });
        // Draw the underline below the link text
        PDF.setDrawColor(255, 255, 255);
        PDF.setLineWidth(0.5); // Thickness of the line
        PDF.line(currentX, currentY + 1, currentX + linkWidth, currentY + 1); // Line below the text
        currentX += linkWidth + 5;
      });

      PDF.setTextColor(255, 255, 255);
      PDF.text('Shivalik Bank is registered with DICGC', pageWidth - 80, footerLinksY, {align:'center', maxWidth: 50});

      const imgWidth = 12;
      const imgHeight = 12;
      const qrCodeX = pageWidth - 25;
      const qrCodeY = footerYStart + 4;
      const dicgcLogoX = pageWidth - 40;
      const dicgcLogoY = footerYStart + 4;
      PDF.addImage('assets/assets/img/footer1.png', 'PNG', qrCodeX, qrCodeY,imgWidth,imgHeight);

      PDF.addImage('assets/assets/img/footer2.png', 'PNG',dicgcLogoX, dicgcLogoY, imgWidth,imgHeight);

      let htmlContentBelow = `
      <table width="95%" style="font-family: Helvetica, Arial, sans-serif;">
          <tr>
              <td style="text-align: left; font-weight: 700; font-size: 18px; color: #025287;">Authorised Signatory</td>
          </tr>
      </table>
      <table width="95%" style="line-height: 22px;">
        <tr>
            <td colspan="1" style="font-size: 13px; font-family: Arial;">
                <p>This is a computer-generated statement and does not require any signature. In Case of Discrepancy
                    please Call Us @ 1800-202-5333 Or Email Us @ <span class="text-primary">customercare@shivalikbank.com</span></p>
            </td>
        </tr>
        <tr>
            <td style="font-size: 13px; font-family: Arial;">
                <p>• Pursuant to regulatory approvals in accordance with the RBI’s circular dated September 27, 2018 on
                    the Voluntary Transition of Primary (Urban) Co-operative Banks (UCBs) into Small Finance Banks
                    (SFBs) and applicable law, the banking business and undertaking of Shivalik Mercantile Co-operative
                    Bank Ltd. (SMCB) has been transferred to Shivalik Small Finance Bank Ltd. (SSFB) with effect from
                    April 26, 2021. Consequently, any business or relationship you may have maintained with SMCB stands
                    transferred to SSFB with effect from the above date, and any transactions undertaken with SMCB prior
                    to April 26, 2021 will remain valid and no prejudice shall be caused to you on account of transfer
                    of the banking business and undertaking of SMCB to SSFB. Please visit <span class="text-primary">www.shivalikbank.com</span> for
                    further details.</p>
            </td>
        </tr>
        <tr>
            <td style="font-size: 13px; font-family: Arial;">
                <p>• The deposits of the Bank are insured with DICGC and in case of liquidation of the Bank or the Bank
                    is reconstructed or amalgamated/merged with another Bank, DICGC is liable to pay each depositor
                    through the liquidator, the amount of his/her deposit upto rupees five lakhs within two months from
                    the date of the claim list from the liquidator.</p>
            </td>
        </tr>
        <tr>
            <td style="font-size: 13px; font-family: Arial;">
                <p>• Please check the balance of your account and previous entries, and inform the bank immediately in
                    case of any discrepancy is found otherwise the bank will not be responsible for any loss occurred in
                    the future.</p>
            </td>
        </tr>
    </table>`

      PDF.html(htmlContentBelow, {
        x: 5, // Starting X coordinate
        y:  pageHeight, // Place below the table
        width: 190, // A4 width minus margins
        windowWidth: 794, // A4 width in pixels at 96 DPI
        margin: [5, 5, 5, 0],
        html2canvas: {
          scale: 0.26, // Adjust scale to fit content
          letterRendering: true,
        },
        callback: function () {
          // Save the final PDF
          PDF.save(`${filename}.pdf`);
        },
      });

      }


      // Save or Print the PDF
      // PDF.html(invoiceElement.innerHTML);

      if (isType == 'DOWNLOAD') {
       if(!isFooter) PDF.save(`${filename}.pdf`);
      } else if (isType == 'PRINT') {
        PDF.autoPrint();
        window.open(PDF.output('bloburl'), '_blank');
      }
    });
  }



  generatePng(_invoiceElement: any, filename: any, customPage?: boolean): void {
    let invoiceElement: any = { _invoiceElement };
    invoiceElement = invoiceElement._invoiceElement;
    html2canvas(invoiceElement, {
      scale: 3, onclone(document: Document, element: HTMLElement) {
        element.querySelector('.qr-bottom')?.classList.remove('d-flex')
      },
    }).then((canvas) => {
      console.log(canvas);
      const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageGeneratedFromTemplate;
      link.download = 'Qrcode';
      link.click();
      link.remove();
    });


    // html2canvas(invoiceElement, {
    //   scale: 3,
    //   onclone(document: Document, element: HTMLElement) {
    //     // element.querySelector('.qr-bottom')?.classList.add('ps-10')
    //   },
    // }).then((canvas) => {
    //   const imageGeneratedFromTemplate = canvas.toDataURL('image/png');

    //   // Create a new container element to center the canvas
    //   const container = document.createElement('div');
    //   container.style.display = 'flex';
    //   container.style.justifyContent = 'center';
    //   container.style.alignItems = 'center';
    //   container.style.height = '100vh'; // You can adjust this height as needed

    //   // Create a new canvas element and add the image to it
    //   const centeredCanvas = document.createElement('canvas');
    //   centeredCanvas.width = canvas.width;
    //   centeredCanvas.height = canvas.height;

    //   console.log("center ", centeredCanvas)

    //   // Append the centered canvas to the container
    //   container.appendChild(centeredCanvas);

    //   console.log("container ", container)

    //   // Append the container to the document
    //   document.body.appendChild(container);

    //   // Create an image element and draw the image onto the centered canvas
    //   const image = new Image();
    //   image.onload = () => {
    //     const context = centeredCanvas.getContext('2d');
    //     if (context) {
    //       context.drawImage(image, 0, 0);
    //       // Trigger the download
    //       const link = document.createElement('a');
    //       link.href = centeredCanvas.toDataURL('image/png');
    //       link.download = 'Qrcode';
    //       link.click();
    //       link.remove();

    //       // Remove the container after the download
    //       container.remove();
    //     }
    //   };
    //   image.src = imageGeneratedFromTemplate;
    // });
  }
}
