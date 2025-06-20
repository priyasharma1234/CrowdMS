import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[invalid]'
})
export class InvalidDirectiveDirective implements OnInit, OnDestroy {
  subscription$: any;
  @Input("invalid") invalid: boolean = false;
  constructor(private control: NgControl, private el: ElementRef) { }
  ngOnInit() {
    this.subscription$ =
      (this.control as any).statusChanges.subscribe((res:any) => {

        this.el.nativeElement.setCustomValidity(res == "INVALID" ? "error" : "");
      });

    if (this.invalid && this.control.invalid)
      this.el.nativeElement.setCustomValidity("error");
  }
  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
