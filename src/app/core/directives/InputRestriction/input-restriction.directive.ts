import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appInputRestriction]',
})
export class InputRestrictionDirective {
  // camelCase
  // lowercase
  // lower-kebab-case
  // lower_snake_case
  // PascalCase
  // Sentencecase
  // UPPERCASE
  // UPPER-KEBAB-CASE
  // UPPER_SNAKE_CASE
  // Title Case
  @Input('appInputRestriction') appInputRestriction!:
    | 'integer'
    | 'alphabets'
    | 'noSpecialChars'
    | 'amount'
    | 'alphanumeric';
  @Input('isSpaceAllow') isSpaceAllow: boolean = false;

  arabicRegex = '[\u0600-\u06FF]';

  constructor(private _el: ElementRef, private _renderer: Renderer2) { }

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {


    // console.log(((event.target as HTMLInputElement).value).toUpperCase());
    // this._el.nativeElement.value = this._el.nativeElement.value.toUpperCase();
    // this._renderer.setProperty(this._el.nativeElement, 'value', value);
    if (this.appInputRestriction === 'integer') {
      this.integerOnly(event);
    } else if (this.appInputRestriction === 'alphabets') {
      this.alphabetsOnly(event);
    } else if (this.appInputRestriction === 'noSpecialChars') {
      this.noSpecialChars(event);
    } else if (this.appInputRestriction === 'amount') {
      this.amountOnly(event);
    } else if (this.appInputRestriction === 'alphanumeric') {
      this.alphanumericOnly(event);
    }
  }

  integerOnly(event: KeyboardEvent) {
    const e = <KeyboardEvent>event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    // if (
    //   [46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
    //   // Allow: Ctrl+A
    //   (e.keyCode === 65 && e.ctrlKey === true) ||
    //   // Allow: Ctrl+C
    //   (e.keyCode === 67 && e.ctrlKey === true) ||
    //   // Allow: Ctrl+V
    //   (e.keyCode === 86 && e.ctrlKey === true) ||
    //   // Allow: Ctrl+X
    //   (e.keyCode === 88 && e.ctrlKey === true)
    // ) {
    //   // let it happen, don't do anything
    //   return;
    // }
    let arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

    if (this.isSpaceAllow) arr.push('.');
    if (
      arr.indexOf(e.key) === -1
    ) {
      e.preventDefault();
    }
  }

  alphabetsOnly(event: KeyboardEvent) {
    const e = <KeyboardEvent>event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    let k;
    k = event.keyCode; // k = event.charCode;  (Both can be used)
    if (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k === 8 ||
      (this.isSpaceAllow && k === 32)
    ) {
      return;
    }
    // const ch = String.fromCharCode(e.keyCode);
    // const regEx = new RegExp(this.arabicRegex);
    // if (regEx.test(ch)) {
    //     return;
    // }
    e.preventDefault();
  }

  noSpecialChars(event: KeyboardEvent) {
    // console.log(event);

    const e = <KeyboardEvent>event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    let k;
    k = event.keyCode; // k = event.charCode;  (Both can be used)
    if (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k === 8 ||
      (k >= 48 && k <= 57) ||
      (this.isSpaceAllow && k === 32)
    ) {
      return;
    }
    // const ch = String.fromCharCode(e.keyCode);
    // const regEx = new RegExp(this.arabicRegex);
    // if (regEx.test(ch)) {
    //     return;
    // }
    e.preventDefault();
  }
  amountOnly(event: KeyboardEvent) {
    const e = <KeyboardEvent>event;

    if (e.key === 'Tab' || e.key === 'TAB') return;

    const currentValue: string = this._el.nativeElement.value;
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
      return;
    }

    // Prevent more than one dot
    if (e.key === '.' && currentValue.includes('.')) {
      e.preventDefault();
    }
  }
  alphanumericOnly(event: KeyboardEvent) {
    const e = <KeyboardEvent>event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
  
    const k = e.key;
    const isAlphaNum = /^[a-zA-Z0-9]$/.test(k);
    const isSpace = this.isSpaceAllow && k === ' ';
  
    if (!isAlphaNum && !isSpace) {
      e.preventDefault();
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: any) {
    let regex: any;
    if (this.appInputRestriction === 'integer') {
      regex = /[0-9\.]/g;
    } else if (this.appInputRestriction === 'noSpecialChars') {
      regex = /[a-zA-Z0-9 ]/g;
    } else if (this.appInputRestriction === 'alphabets') {
      regex = /[a-zA-Z ]/g;
    } else if (this.appInputRestriction === 'amount') {
      regex = /^[0-9]*\.?[0-9]*$/;
    }else if (this.appInputRestriction === 'alphanumeric') {
      regex = this.isSpaceAllow ? /^[a-zA-Z0-9 ]+$/ : /^[a-zA-Z0-9]+$/;
    }
    const e: any = <ClipboardEventInit>event;
    const pasteData = (e.clipboardData as DataTransfer).getData('text/plain');

    let m;
    let matches = 0;
    while ((m = regex.exec(pasteData)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      // The result can be accessed through the `m`-variable.
      m.forEach((match: any, groupIndex: number) => {
        matches++;
      });
    }
    if (matches === pasteData.length) {
      return;
    } else {
      e.preventDefault();
    }
  }
}
