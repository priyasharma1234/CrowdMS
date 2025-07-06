import { Component } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpHeaders} from '@angular/common/http';
import {ApiRequestService} from '../../services/api-request.service';
import {DynamicTableModule} from '@ciphersquare/dynamic-table';

@Component({
  selector: 'app-release',
  imports: [
    DynamicTableModule
  ],
  templateUrl: './release.component.html',
  styleUrl: './release.component.scss',
  standalone: true
})
export class ReleaseComponent {

  protected readonly environment = environment;
  protected httpHeaders: HttpHeaders;

  constructor(
    private _ApiRequestService: ApiRequestService
  ) {
    this.httpHeaders = this._ApiRequestService.getTableApiHeaders();
  }
  onTableAction($event: { type: string; row: any }) {
    console.log('Table action triggered:', $event);
  }
}
