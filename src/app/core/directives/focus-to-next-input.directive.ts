import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appFocusToNextInput]',
})
export class FocusToNextInputDirective {
  @Input() focusAfterLastInput: any = null;
  @Input('isBorderFocus') isBorderFocus: boolean = false;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _el: ElementRef,
    private renderer: Renderer2
  ) {
  }

  @HostListener('keyup', ['$event']) onKeyDown(e: any) {

    if (e.keyCode == 9 || e.keyCode == 16) {
      return;
    }
    if (
      e.srcElement.previousElementSibling &&
      (e.keyCode == 8 || e.keyCode == 46)
    ) {
      e.srcElement.previousElementSibling.value = '';
      e.srcElement.previousElementSibling.focus();
      if(this.isBorderFocus) this.addFocusBorder(e.srcElement.previousElementSibling, false);
      return;
    }
    if (e.srcElement.value.length === 1) {
      e.preventDefault();

      let nextControl: any = e.srcElement.nextElementSibling;
      // let nextControl: any = this._el.nativeElement;
      // Searching for next similar control to set it focus
      // while (true) {
      if (nextControl) {
        if (nextControl.type === e.srcElement.type) {
          nextControl.focus();
          if(this.isBorderFocus)  this.addFocusBorder(nextControl);
          return;
        }
      } else {
        if (document.querySelectorAll(this.focusAfterLastInput)[0]) {
          document.querySelectorAll(this.focusAfterLastInput)[0].focus();
          if(this.isBorderFocus) this.addFocusBorder(document.querySelectorAll(this.focusAfterLastInput)[0]);
        }
        return;
      }
      // }
    }
  }


  private addFocusBorder(element: any, borderType:boolean = true ) {
    // Remove border focus from all input elements

    if(!borderType){
      const allInputs = this.document.querySelectorAll('input');
      allInputs.forEach(input => {
        this.renderer.removeStyle(input, 'border');
      });
    }

// Add border to all previous input elements and the current one
    let currentElement: HTMLElement | null = element;
    while (currentElement) {
      if (currentElement.tagName === 'INPUT') {
        this.renderer.setStyle(currentElement, 'border', '2px solid #4CAF50');
      }
      currentElement = currentElement.previousElementSibling as HTMLElement;
    }

  }
}
