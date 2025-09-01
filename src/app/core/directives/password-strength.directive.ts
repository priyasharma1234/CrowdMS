import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPasswordStrength]'
})
export class PasswordStrengthDirective {

  @Output() passwordStrength = new EventEmitter<{ weak: boolean, medium: boolean, strong: boolean }>();

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event']) onInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;

    // Define password strength patterns
    const mediumRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{12,}$/;

    // Determine strength
    const isWeak = inputValue.length > 0 && !mediumRegex.test(inputValue);
    const isMedium = mediumRegex.test(inputValue) && !strongRegex.test(inputValue);
    const isStrong = strongRegex.test(inputValue);

    // Emit the strength status
    this.passwordStrength.emit({ weak: isWeak, medium: isMedium, strong: isStrong });

    // Apply styles based on strength
    // this.applyStrengthStyles(isWeak, isMedium, isStrong);
  }

  private applyStrengthStyles(weak: boolean, medium: boolean, strong: boolean) {
    this.renderer.removeClass(this.el.nativeElement, 'weak');
    this.renderer.removeClass(this.el.nativeElement, 'medium');
    this.renderer.removeClass(this.el.nativeElement, 'strong');

    if (weak) this.renderer.addClass(this.el.nativeElement, 'weak');
    if (medium) this.renderer.addClass(this.el.nativeElement, 'medium');
    if (strong) this.renderer.addClass(this.el.nativeElement, 'strong');
  }

}
