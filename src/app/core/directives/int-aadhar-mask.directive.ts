import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from "@angular/core";

@Directive({
  selector: '[inputMaskAadhar]',
})

export class inputMaskAadharDirective {

  tempAdhar: any
  d: number[][];
  p: number[][];

  count = 1;
  tempData = null;

  @Output() addharNumber: EventEmitter<any> = new EventEmitter();


  constructor(private el: ElementRef) {
    this.d = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];

    // permutation table p
    this.p = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];
  }

  @HostListener('input', ['$event']) onInput(_event: any) {
    setTimeout(() => {
      this.change(this.el.nativeElement.value)
    }, 100)
  }

  private change(value: any) {
    switch (value.length) {
      case 1:
        this.tempAdhar = value
        this.el.nativeElement.value = value.split(value).join('X')
        break;
      case 2:
        this.tempAdhar = this.tempAdhar?.concat(value.substring(1))
        this.el.nativeElement.value = value.split(value).join('XX')
        break;
      case 3:
        this.tempAdhar = this.tempAdhar?.concat(value.substring(2))
        this.el.nativeElement.value = value.split(value).join('XXX')
        break;
      case 4:
        this.tempAdhar = this.tempAdhar?.concat(value.substring(3))
        this.el.nativeElement.value = value.split(value).join('XXXX')
        break;
      case 5:
        this.tempAdhar = this.tempAdhar?.concat(value.substring(4))
        this.el.nativeElement.value = value.split(value).join('XXXXX')
        break;
      case 6:
        this.tempAdhar = this.tempAdhar?.concat(value.substring(5))
        this.el.nativeElement.value = value.split(value).join('XXXXXX')
        break;
      case 7:
        this.tempAdhar = this.tempAdhar?.concat(value.substring(6))
        this.el.nativeElement.value = value.split(value).join('XXXXXXX')
        break;
      case 8:
        this.tempAdhar = this.tempAdhar?.concat(value.substring(7))
        this.el.nativeElement.value = value.split(value).join('XXXXXXXX')
        break;
      case 9:
        this.tempAdhar = this.tempAdhar?.concat(value.substring(8))
        break;
      case 10:
        this.tempAdhar = this.tempAdhar?.concat(value.substring(9))
        break;
      case 11:
        this.tempAdhar = this.tempAdhar?.concat(value.substring(10))
        break;
      case 12:
        this.tempAdhar = this.tempAdhar?.concat(value.substring(11))
        break;
    }
    this.isValidUidaiNumber(this.tempAdhar)
  }

  // validates checksum
  validate(array: any) {
    var c = 0;
    var invertedArray = this.invArray(array);
    var has_only_numbers = !invertedArray.some(isNaN);
    if (has_only_numbers == false) {
      return false;
    } else {
      for (var i = 0; i < invertedArray.length; i++) {
        c = this.d[c][this.p[(i % 8)][invertedArray[i]]];
      }
      return (c === 0);
    }
  }

  // converts string or number to an array and inverts it
  invArray(array: any) {
    if (Object.prototype.toString.call(array) === "[object Number]") {
      array = String(array);
    }
    if (Object.prototype.toString.call(array) === "[object String]") {
      array = array.split("").map(Number);
    }
    return array.reverse();
  }
  isValidUidaiNumber(aadhaar_no: any): void {
    if (aadhaar_no.length != 12 || aadhaar_no.startsWith('0') || aadhaar_no.startsWith('1')) {
      this.addharNumber.emit(false);
    } else {
      const addharNumber: any = this.validate(aadhaar_no);
      this.addharNumber.emit(addharNumber? aadhaar_no: false);
    }
  }

}
