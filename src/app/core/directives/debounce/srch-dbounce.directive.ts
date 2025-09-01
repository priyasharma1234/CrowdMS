import { Directive, HostListener } from "@angular/core";
import { AbstractDebounceDirective } from "./abstract-debounce.directive";
@Directive({
  selector: '[appSrchDbounce]'
})
export class SrchDbounceDirective extends AbstractDebounceDirective {
  constructor() {
    super();
  }

  @HostListener("keyup", ["$event"])
  public onKeyUp(event: any): void {
    event.preventDefault();
    //console.log(event);

    if (event.keyCode != 32 && event.keyCode != 16 && event.keyCode != 17 && event.keyCode != 18 && event.keyCode != 9) {
      this.emitEvent$.next(event);
    }

  }
}
