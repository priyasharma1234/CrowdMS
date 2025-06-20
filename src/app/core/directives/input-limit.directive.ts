import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appInputLimit]'
})
export class InputLimitDirective {
  @Input('maxDigits') maxDigits: any = 4;

  constructor(private renderer: Renderer2, private el: ElementRef) { 
    this.renderer.setProperty(this.el.nativeElement, 'maxLength', '9'.repeat(this.maxDigits));
  }

  @HostListener('keydown', ['$event']) onKeydown(e: any) {
    // console.log("event fire");
    
    const limit  = +this.maxDigits;
    if (e.keyCode > 47 && e.keyCode < 127) {
      if (e.target.value.length === limit) { e.preventDefault(); }
    }
  }


}
