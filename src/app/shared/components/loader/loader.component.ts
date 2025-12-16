
import { Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { SharedModule } from '../../shared.module';
import { LoaderService } from 'src/app/services/loader.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone:true,
  imports:[SharedModule],
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

