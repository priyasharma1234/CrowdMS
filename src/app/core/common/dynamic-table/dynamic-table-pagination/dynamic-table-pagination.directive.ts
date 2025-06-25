import { Directive, ElementRef, Input, Renderer2, SimpleChanges } from '@angular/core';
import { DynamicTableService } from '../dynamic-table.service';

@Directive({
  selector: '[appDynamicTablePagination]'
})
export class DynamicTablePaginationDirective {

  @Input() paginationDetails: any;
  @Input() totalPages: any;
  @Input() currentPage: any;
  $pagination: any;
  $adjacents: any = 3;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private _DynamicTableService: DynamicTableService
  ) { }
  ngOnInit(): void {
    this.setPager();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.setPager();
  }

  setPager() {
    let divEle = this.elRef.nativeElement;
    const childElements = this.elRef.nativeElement.children;
    for (let child of childElements) {
      this.renderer.removeChild(this.elRef.nativeElement, child);
    }

    let $lastpage = this.totalPages;
    let $page = this.currentPage;
    this.$pagination = '';

    if ($lastpage > 1) {
      if ($lastpage < 7 + this.$adjacents * 2) {
        for (let $counter = 1; $counter <= $lastpage; $counter++) {
          if ($counter == $page) {
            this.setCurrent($counter, divEle);
          } else this.setCounter($counter, divEle);
        }
      } else if ($lastpage > 5 + this.$adjacents * 2) {
        if ($page < 1 + this.$adjacents * 2) {
          for (
            let $counter = 1;
            $counter < 4 + this.$adjacents * 2;
            $counter++
          ) {
            if ($counter == $page) {
              this.setCurrent($counter, divEle);
            } else this.setCounter($counter, divEle);
          }
          this.setLastPage($lastpage, divEle);
        } else if (
          $lastpage - this.$adjacents * 2 > $page &&
          $page > this.$adjacents * 2
        ) {
          this.setFirstPage(divEle);
          for (
            let $counter = $page - this.$adjacents;
            $counter <= $page + this.$adjacents;
            $counter++
          ) {
            if ($counter == $page) {
              this.setCurrent($counter, divEle);
            } else this.setCounter($counter, divEle);
          }
          this.setLastPage($lastpage, divEle);
        } else {
          this.setFirstPage(divEle);
          for (
            let $counter = $lastpage - (2 + this.$adjacents * 2);
            $counter <= $lastpage;
            $counter++
          ) {
            if ($counter == $page) {
              this.setCurrent($counter, divEle);
            } else this.setCounter($counter, divEle);
          }
        }
      }
    }
  }

  setFirstPage(divEle: any) {
    const aTag1 = this.renderer.createElement('a');
    const aTagText = this.renderer.createText('1...');
    this.renderer.appendChild(aTag1, aTagText);
    this.renderer.appendChild(divEle, aTag1);
    this.renderer.listen(aTag1, 'click', (e) => {
      e.stopPropagation();
      this._DynamicTableService.dtUpdateByPagination(1, this.paginationDetails);
    });
  }

  setCounter($counter: any, divEle: any) {
    const aTag2 = this.renderer.createElement('a');
    const aTagText = this.renderer.createText($counter.toString());
    this.renderer.addClass(aTag2, 'click');
    this.renderer.appendChild(aTag2, aTagText);
    this.renderer.appendChild(divEle, aTag2);
    this.renderer.listen(aTag2, 'click', (e) => {
      e.stopPropagation();
      this._DynamicTableService.dtUpdateByPagination($counter, this.paginationDetails);
    });
  }

  setCurrent($counter: any, divEle: any) {
    this.$pagination += '<span>' + $counter + '</span>';
    const span = this.renderer.createElement('span');
    const spanText = this.renderer.createText($counter.toString());
    this.renderer.setStyle(span, 'font-size', '20px');
    this.renderer.appendChild(span, spanText);
    this.renderer.appendChild(divEle, span);
  }

  setLastPage($lastpage: any, divEle: any) {
    const aTag3 = this.renderer.createElement('a');
    const aTagText = this.renderer.createText('...' + $lastpage);
    this.renderer.appendChild(aTag3, aTagText);
    this.renderer.listen(aTag3, 'click', (e) => {
      e.stopPropagation();
      this._DynamicTableService.dtUpdateByPagination( +$lastpage,this.paginationDetails);
    });
    this.renderer.appendChild(divEle, aTag3);
  }

}
