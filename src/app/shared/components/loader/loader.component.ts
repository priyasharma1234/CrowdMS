
import { Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';
import { Subject, takeUntil } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  standalone:true,
  imports:[NgIf],
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})

export class LoaderComponent implements OnInit,OnChanges {
 active: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(private loader: LoaderService) {
    this.loader.isLoading.pipe(takeUntil(this.destroy$)).subscribe((isLoading: boolean) => {
      setTimeout(() => {
        this.active = isLoading;
      }, 1);
    });
  }

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);

  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

