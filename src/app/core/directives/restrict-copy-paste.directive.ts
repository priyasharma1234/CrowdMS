import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appRestrictCopyPaste]'
})
export class RestrictCopyPasteDirective {

  constructor() { }

  @HostListener('copy', ['$event'])
  @HostListener('cut', ['$event'])
  @HostListener('paste', ['$event'])
  onPreventAction(event: ClipboardEvent) {
    event.preventDefault(); // Prevent copy, cut, and paste actions
  }

}
