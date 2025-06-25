import { LoaderService } from './../../../core/services/loader.service';

import { Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { Subscription } from 'rxjs';

@Component({
  standalone:true,
  imports:[SharedModule],
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})

export class LoaderComponent implements OnInit,OnChanges {
  active: boolean = true;

  constructor(private loader: LoaderService) {
    this.loader.isLoading.subscribe((isLoading: boolean) => {
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


}

