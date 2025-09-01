import { Directive, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, debounceTime, distinctUntilChanged, tap } from "rxjs/operators";

@Directive({
  selector: '[appAbstractDebounce]'
})
export class AbstractDebounceDirective implements OnDestroy {
  @Input()
  public debounceTime: number;

  @Input()
  public minLength: number = 3;

  @Output()
  public onEvent: EventEmitter<any>;

  protected emitEvent$: Subject<any>;
  protected subscription$: Subject<void>;

  constructor() {
    this.debounceTime = 500;
    this.onEvent = new EventEmitter<any>();
    this.emitEvent$ = new Subject<any>();
    this.subscription$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.emitEvent$
      .pipe(
        takeUntil(this.subscription$),
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        tap(value => this.emitChange(value))
      )
      .subscribe();
  }

  public emitChange(value: any): void {


    if (value.target.value.length > this.minLength || value.target.value.length === 0) {
      this.onEvent.emit(value);
    }
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

}
