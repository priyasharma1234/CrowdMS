import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthCoreService } from 'src/app/services/auth-core.service';

@Component({
  selector: 'app-top-bar',
  imports: [RouterModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent implements OnInit {
      titleName: any;
    private _CommonService = inject(CommonService)
    public set _titleName(v: string) {
        this.titleName = v;
    }

    public get _titleName(): string {
        return this.titleName;
    }
  constructor(
    public _AuthCoreService: AuthCoreService
  ) {
     this._CommonService.pageTitle.subscribe((e: any) => {
            this._titleName = e;
        })
  }


  ngOnInit(): void {

  }
    logOut() {
    this._AuthCoreService.logout(false,'You have been logged out successfully');
  }
}
