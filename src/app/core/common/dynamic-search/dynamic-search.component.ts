import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


@Component({
  selector: 'app-dynamic-search',
  templateUrl: './dynamic-search.component.html',
  styleUrls: ['./dynamic-search.component.scss']
})
export class DynamicSearchComponent {
  @Output() searchEvent = new EventEmitter<any>();
  searchForm: FormGroup;
  appliedFilters: { name: string, selectedFilterValue: string, searchType: string, value: string, values?: any }[] = [];
  private _defaultFilters: any = undefined;
  private _filters: any = {};
  @Input() set filters(value: any) {
    this._defaultFilters ??= value;
    this._filters = value;
  }
  get filterOptions(): any {
    return this._filters;
  }

  @Input() set appliedDefaultfilters(value: any) {
    if (value) {
      this.appliedFilters = value;
    } else {
      this.appliedDefaultfilters = []
    }
  }
  dynamicSearchFilterObj: any;
  @Input() set searchFilterObj(value: any) {
    if (value) {
      this.dynamicSearchFilterObj = value;
    }
  }

  constructor(private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      selectedFilter: [''],
      selectedFilterType: [null],
      filterValue: ['']
    });
    this.searchForm.controls['selectedFilter'].valueChanges.subscribe((value: any) => {
      this.searchForm.patchValue({
        selectedFilterType: null,
        filterValue: ''
      });

      this.selectedFilter = this.filterOptions.find((item: any) => item.name === value);
      if (this.selectedFilter) {
        if (this.selectedFilter.searchType) {
          this.searchForm.controls['selectedFilterType'].setValue(this.selectedFilter.searchType[0]);
        }
      }
    });

  }

  ngOnInit() {
    if(this.dynamicSearchFilterObj){
    if (Object.keys(this.dynamicSearchFilterObj)?.length === 0) return;
    this.SetFormValue(this.dynamicSearchFilterObj);
    }

  }

  onSearch() {
    const selectedFilter = this.searchForm.controls['selectedFilter'].value;
    const filterValue = this.searchForm.controls['filterValue'].value;
    const selectedFilterType = this.searchForm.controls['selectedFilterType'].value;
    if (selectedFilter && filterValue) {
      this.appliedFilters = this.appliedFilters.filter((item: any) => {
        return item.name != selectedFilter;
      })
      const newFilter = { name: selectedFilter, selectedFilterValue: this.selectedFilter.value, value: filterValue, values: this.selectedFilter.values, searchType: selectedFilterType };
      this.appliedFilters.push(newFilter);

      this.filters = this._filters.filter((item: any) => {
        return item.name !== selectedFilter;
      });
      this.searchEvent.emit({ filters: this.appliedFilters });
      this.searchForm.reset();
      this.searchForm.controls['selectedFilter'].setValue(this._filters[0].name);
    }
    else {
    }
  }
  refreshFilters() {
    this.filters = this._defaultFilters;
    this.appliedFilters.forEach((filter: any) => {
      this.filters = this._filters.filter((item: any) => {
        return item.name !== filter.name;
      });
    });
    this.searchForm.controls['selectedFilter'].setValue(this._filters[0].name);
  }

  removeFilter(index: number) {
    this.appliedFilters.splice(index, 1);
    this.refreshFilters();
    this.searchEvent.emit({ filters: this.appliedFilters });
  }

  selectedFilter: any;
  SetFormValue(filter: any) {
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        const value = filter[key];
        this.searchForm.controls['selectedFilter'].setValue(key);
        this.searchForm.controls['selectedFilterType'].setValue('equal');
        if (this.selectedFilter?.values) {
          this.searchForm.controls['filterValue'].setValue(value);
        }
     
      }
      this.onSearch();
    }
  }

}
