import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appGlobalInputHighlight]'
})
export class GlobalInputHighlightDirective {

  // @Input() public autoFocus: boolean;

  constructor(private el: ElementRef) { }

  public ngAfterContentInit(): void {
    setTimeout( () => {
    this.el.nativeElement.focus();
    // document.getElementById("global-search-input").focus();
    //console.log(this.el.nativeElement.focus())
    }, 500)
    
    }
  

}
