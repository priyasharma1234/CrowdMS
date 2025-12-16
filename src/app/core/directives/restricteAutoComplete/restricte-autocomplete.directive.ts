import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: 'form'
})
export class RestricteAutocompleteDirective implements OnInit {

  constructor(private _ElementRef: ElementRef, private _Renderer2: Renderer2) {
    const INPUT = this._Renderer2.createElement('INPUT');
    // <input autocomplete="false" name="hidden" type="text" style="display:none;">
    this._Renderer2.setAttribute(this._ElementRef.nativeElement, 'autocomplete', 'false');
    this._Renderer2.setStyle(INPUT, 'display', 'none');
    this._Renderer2.setAttribute(INPUT, 'type', 'text');
    this._Renderer2.setAttribute(INPUT, 'autocomplete', 'false');
    this._Renderer2.setAttribute(INPUT, 'name', 'hidden');
    this._Renderer2.insertBefore(this._ElementRef.nativeElement, INPUT, this._ElementRef.nativeElement.firstChild)
   }

  ngOnInit(): void {

  }
}
