import {
    Directive,
    ElementRef,
    HostListener,
    AfterViewInit,
    Input
  } from "@angular/core";
  
  @Directive({
    selector: "form"
  })
  export class FormFocusDirective implements AfterViewInit {
    @Input('iSFocus')iSFocus:boolean = true;
    focusables = ["input", "select", "textarea"];
  
    constructor(private element: ElementRef) {}
  
    ngAfterViewInit() {
      const input = this.element.nativeElement.querySelector(this.focusables.join(",")
      );
      // console.log("input", input)
      if (input && this.iSFocus) {
        input.focus();
      }
    }
  
    @HostListener("submit")
    submit() {
      const input = this.element.nativeElement.querySelector(
        this.focusables.map(x => `${x}.ng-invalid`).join(",")
      );
      if (input) {
        input.focus();
      }
    }
  }


// import { Directive, Input, ElementRef, HostListener } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// // import { EnterAsATabService } from '../services/enter-as-a-tab.service';
// type IKNOWISNUMBER = any;
// type IKNOWISSTRING = any;

// @Directive({
//   selector: '[autoFocus]',
// })
// export class FormFocusDirective {
//   selectedInput: BehaviorSubject<number> = new BehaviorSubject<number>(1);
//   private _index!: number;
//   get index(): IKNOWISNUMBER {
//     return this._index;
//   }
//   @Input('appEnterAsATab')
//   set index(i: IKNOWISSTRING) {
//     this._index = parseInt(i);
//   }
//   @HostListener('keydown', ['$event'])
//   onInput(e: any) {
//     if (e.which === 13) {
//       this.selectedInput.next(this.index + 1);
//       e.preventDefault();
//     }
//   }
//   constructor(private el: ElementRef) {}

//   ngOnInit() {
//     this.selectedInput.subscribe((i) => {
//       if (i === this.index) {
//         if (this.el.nativeElement.type == 'text'|| this.el.nativeElement.type == "select-one") {
//           this.el.nativeElement.focus();
//         }
//         if (this.el.nativeElement.type == 'submit') {
//           this.el.nativeElement.focus();
//           this.el.nativeElement.click();
//         }
//         if (this.el.nativeElement.type == 'submit' && this.el.nativeElement.id == 'final' ) {
//           this.el.nativeElement.focus();
//           setTimeout(() => {
//             this.selectedInput.next(1);
//           }, 500);
//         }
        
//       }
//     });
//   }
// }
 