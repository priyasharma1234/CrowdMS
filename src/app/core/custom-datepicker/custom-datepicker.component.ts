import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustConfg } from './ngx-datePicker-CustConfg';
import { CommonModule } from '@angular/common';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-custom-datepicker',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './custom-datepicker.component.html',
  styleUrls: ['./custom-datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDatepickerComponent),
      multi: true,
    },
  ],
})
export class CustomDatepickerComponent implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor {
  @Input('datepickerType') datepickerType?: 'bsDaterangepicker' | 'bsDatepicker' = 'bsDaterangepicker';

  @ViewChild('rangePicker') rangePicker: any;
  // @Output() onDateSelect: EventEmitter<any> = new EventEmitter();
  // selectdate: FormControl = new FormControl()
  @Input('bsCustConfg') bsCustConfg?: Partial<BsDatepickerConfig>
  @Input() dateFormate?: string;
  @Input() class: any = '';
  @Input() showDateFormate?: string;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() connectedBanking: any;
  @Input() placeholder?: string = 'Select Date';
  @Input() previousNext?: boolean = false;
  @Output() showDateFormateValue: EventEmitter<any> = new EventEmitter();
  // @HostBinding('class')
  protected _class = this.class;
  // minDate: Date;
  // maxDate: Date = new Date();
  _bsCustConfg: any = CustConfg;

  input: any = null;

  item: any = null;
  isFirst: boolean = true;
  bsValue = new Date();
  connectedValue: any;

  constructor(
    private _CommonService: CommonService,
    private ele: ElementRef
  ) {
    // console.log("CustConfg config ", CustConfg, this.connectedBanking)

  }

  ngOnInit(): void {
    if (this.bsCustConfg) {
      this._bsCustConfg = {
        ...CustConfg,
        ...this.bsCustConfg
      }
    }

  }
  ngAfterViewInit(): void {
    // setTimeout(() => {
    // }, 1);

    setTimeout(() => {
      // console.log((this.ele.nativeElement));
      // console.log(this.class);
      // console.log((this.rangePicker as ElementRef).nativeElement);
      // console.log((this.rangePicker._elementRef.nativeElement));
      const l = this.class.split(' ').forEach((e: any) => {
        // console.log(e);

        (this.rangePicker._elementRef.nativeElement).classList.add(e)
      })
      // ((this.rangePicker as ElementRef).nativeElement as HTMLElement).setAttribute('class', this.class)
    }, 1);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['connectedBanking']) {
      this.connectedValue = changes['connectedBanking']?.currentValue

    }
  }

  onDateRangePickerShow() {
    // This is a workaround to show previous month

    var prevMonth = new Date();
    if (this.datepickerType == 'bsDaterangepicker') {
      prevMonth.setMonth(prevMonth.getMonth() - 1);
    }

    else if (this.datepickerType == 'bsDatepicker' && !this.connectedValue) {
      prevMonth.setMonth(prevMonth.getMonth());
    }
    else if (this.datepickerType == 'bsDatepicker' && this.connectedValue) {
      prevMonth.setMonth(prevMonth.getMonth() + 1);
    }

    this.rangePicker._datepicker.instance.monthSelectHandler({
      date: prevMonth,
    });
  }

  dateRangeTransform(v: any) {

    let dt: any;
    if (!v) {
      this.onChange()
      return
    }
    console.log(v);

    if (this.dateFormate) {
      dt = [
        this._CommonService.getTransformDate(v[0], this.dateFormate),
        this._CommonService.getTransformDate(v[1], this.dateFormate)
      ];
    }
    // console.log(dt);

    if (this.showDateFormate) {
      let dta: any;
      dta = [
        this._CommonService.getTransformDate(v[0], this.showDateFormate),
        this._CommonService.getTransformDate(v[1], this.showDateFormate)
      ];
      // console.log(dta);

      this.showDateFormateValue.emit(dta);
    }
    setTimeout(() => {

      this.onChange(this.dateFormate ? dt : v);
    }, 1);
    // this._CommonService.getTransformDate
  }

  singleRateTransform(v: any) {
    let dt: any;

    if (!v) {
      this.onChange();
      return
    }
    if (this.dateFormate && this.input != 'Invalid Date') {
      dt = this._CommonService.getTransformDate(v, this.dateFormate);
    }
    // console.log(dt);

    if (this.showDateFormate) {
      let dta: any;
      dta = this._CommonService.getTransformDate(v, this.showDateFormate);
      // console.log(dta);
      this.showDateFormateValue.emit(dta);
    }

    setTimeout(() => {
      this.onChange(this.dateFormate ? dt : v);
      this.setFloatingLable();
    }, 1);
  }
  onfocus() {
    if ((this.rangePicker._elementRef.nativeElement).closest('.floating-label')) {
      (this.rangePicker._elementRef.nativeElement).closest('.floating-label').classList.add('fltLbValid');
    }
  }
  onBlur() {
    setTimeout(() => {
      if (!this.input) {
        (this.rangePicker._elementRef.nativeElement).closest('.floating-label').classList.remove('fltLbValid');
      }
    }, 1);
    this.onTouch()
  }

  setFloatingLable() {
    let ele = (this.rangePicker._elementRef.nativeElement).closest('.floating-label');
    if (ele) {
      if (!this.input) {
        ele.classList.remove('fltLbValid');
      } else {
        ele.classList.add('fltLbValid');

      }
    }
  }

  /*ControlValueAccessor Functions */

  onChange: any = () => { };
  onTouch: any = () => { };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(input: any) {
    this.input = input;

    console.log("write value called", this.input);
    if (input === null || input === '') {
      this.onChange();  // Important for manual clearing
    }
    //  this.onChange(null); 

    setTimeout(() => {
      this.setFloatingLable();
    }, 1);
    // let dt: any;
    // console.log(input);
    if (this.datepickerType == 'bsDaterangepicker') {
      this.dateRangeTransform(input);
    } else if (this.datepickerType == 'bsDatepicker') {
      this.singleRateTransform(input);
    }

    // this.onChange(input);
  }
}
