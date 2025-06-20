import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appShowHidePassword]',
})
export class ShowHidePasswordDirective {
  // constructor(
  //   private ele: ElementRef,
  //   private renderr2: Renderer2
  // ) { }

  // ngOnInit(): void {
  //   console.log(this.ele);

  // }
  private _shown = false;
  private timeoutId: any;

  constructor(private el: ElementRef) {
    const parent = this.el.nativeElement.parentNode;
    const span = document.createElement('span');
    span.classList.add('pw-eye');
    span.innerHTML = '<i class="fas fa-eye-slash"></i>';
    span.addEventListener('click', () => {
      this.toggle(span);
    });
    parent.appendChild(span);
  }

  toggle(span: HTMLElement) {
    this._shown = !this._shown;
    if (this._shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      span.innerHTML = `<i class="fas fa-eye"></i>`;
      // Set a timeout to hide the password after 5 seconds
      this.timeoutId = setTimeout(() => {
        this.hidePassword(span);
      }, 3000);
    } else {
      // this.el.nativeElement.setAttribute('type', 'password');
      // span.innerHTML = `<i class="fas fa-eye-slash"></i>`;
      this.hidePassword(span);
    }
  }

  private hidePassword(span: HTMLElement) {
    this.el.nativeElement.setAttribute('type', 'password');
    span.innerHTML = `<i class="fas fa-eye-slash"></i>`;
    this._shown = false;

    // Clear any ongoing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
