import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { BasicDetailsComponent } from '../pages/dashboard/edit-escrow/basic-details/basic-details.component';
// import { AggrementComponent } from '../pages/dashboard/edit-escrow/aggrement/aggrement.component';
// import { DepositComponent } from '../pages/dashboard/edit-escrow/deposit/deposit.component';

import { ApiRequestService } from './api-request.service';
import { apiRoutes } from '../config/api-request';
// import { EscrowActivationComponent } from '../pages/dashboard/view-escrow/escrow-activation/escrow-activation.component';
import { NgxToasterService } from '../core/services/toasterNgs.service';
import { IEscrow } from '../pages/dashboard/edit-escrow/edit-escrow-types';

@Injectable({
  providedIn: 'root'
})
export class EditEscrowService {
  private _selectedTab$ = new BehaviorSubject<'depositor' | 'beneficiary'>('depositor');
  set selectedTab(tab: 'depositor' | 'beneficiary') {
    this._selectedTab$.next(tab);
  }
  get selectedTab$() {
    return this._selectedTab$.asObservable();
  }
  get selectedTabValue() {
    return this._selectedTab$.getValue();
  }
  private m_escrowDetails: BehaviorSubject<IEscrow> | undefined;

  constructor(
    private _ApiRequestService: ApiRequestService,
    private _NgxToasterService: NgxToasterService
  ) {
  }

  private m_currentStep = new BehaviorSubject(1); // Index for "Deposit" step

  get currentStep() {
    return this.m_currentStep.value;
  }

  set currentStep(_value) {
    this.m_currentStep.next(_value);
  }

  get currentStep$() {
    return this.m_currentStep.asObservable();
  }

  get escrowDetails() {
    if (this.m_escrowDetails == undefined) return undefined;
    return this.m_escrowDetails?.value;
  }

  get escrowDetails$() {
    return this.m_escrowDetails?.asObservable();
  }

  set escrowDetails(_value: IEscrow | undefined) {
    if (_value == undefined) throw new Error('Cannot set undefined value to escrow');
    if (this.m_escrowDetails == undefined) {
      this.m_escrowDetails = new BehaviorSubject<IEscrow>(_value);
    } else {
      this.m_escrowDetails?.next(_value);
    }
  }

  //   SetSteps(_type: 'depositor' | 'beneficiary', _escrowType: 'Software' | 'Physical', _stage: string) {
  //     if (_type === 'depositor' && _escrowType == 'Software' && _stage !== 'ACTIVE') {
  //       this.steps = this.depositorSteps;
  //     } else if (_type == 'depositor' && _escrowType == 'Physical' && _stage !== 'ACTIVE') {
  //       this.steps = this.depositorPhySteps
  //     }
  //     else if (_type === 'beneficiary' && _stage !== 'ACTIVE') {
  //       this.steps = this.beneficiarySteps;
  //     }
  //     else if (_stage == 'ACTIVE') {
  //       this.steps = this.viewSteps;
  //     }
  //     else {
  //       throw new Error('Invalid type provided to SetSteps');
  //     }
  //   }

  //   depositorSteps = [
  //     {
  //       name: 'Basic Details', step: 1, component: BasicDetailsComponent, route: ''
  //     },
  //     {
  //       name: 'Agreement', step: 2, component: AggrementComponent, route: 'dashboard/edit-escrow/agreement'
  //     },

  //     {
  //       name: 'Approve', step: 3, component: AggrementComponent, route: 'dashboard/edit-escrow/approve-details'
  //     },
  //     {
  //       name: 'Add IP\'s', step: 4, component: AggrementComponent, route: 'dashboard/edit-escrow/add-ip'
  //     },
  //     {
  //       name: 'Deposit', step: 5, component: DepositComponent, route: 'dashboard/edit-escrow/deposit'
  //     }
  //   ];

  //   depositorPhySteps = [
  //     {
  //       name: 'Basic Details', step: 1, component: BasicDetailsComponent, route: ''
  //     },
  //     {
  //       name: 'Agreement', step: 2, component: AggrementComponent, route: 'dashboard/edit-escrow/agreement'
  //     },
  //     {
  //       name: 'Deposit', step: 3, component: DepositComponent, route: 'dashboard/edit-escrow/deposit'
  //     },

  //     {
  //       name: 'Approve', step: 4, component: AggrementComponent, route: 'dashboard/edit-escrow/approve-details'
  //     },

  //   ];

  //   beneficiarySteps = [
  //     {
  //       name: 'Basic Details', step: 1, component: BasicDetailsComponent, route: ''
  //     },
  //     {
  //       name: 'Agreement', step: 2, component: AggrementComponent, route: 'dashboard/edit-escrow/agreement'
  //     },

  //     {
  //       name: 'Deposit', step: 3, component: DepositComponent, route: 'dashboard/edit-escrow/deposit'
  //     },
  //     {
  //       name: 'Approve', step: 4, component: AggrementComponent, route: 'dashboard/edit-escrow/approve-details'
  //     },
  //     {
  //       name: 'Add IP\'s', step: 5, component: AggrementComponent, route: 'dashboard/edit-escrow/add-ip'
  //     },

  //   ];

  viewSteps = [
    {
      name: 'Admin Onboarding', step: 1, component: '', route: ''
    },
    {
      name: 'Depositor Review & Deposit', step: 2, component: '', route: 'dashboard/edit-escrow/agreement'
    },

    {
      name: 'Beneficiary Review & Verify Deposit', step: 3, component: '', route: 'dashboard/edit-escrow/deposit'
    },
    {
      name: 'Escrow Activation', step: 4, component: '', route: ''
    },
    {
      name: 'Release', step: 5, component: '', route: 'dashboard/edit-escrow/add-ip'
    },
    {
      name: 'Exit Agreement', step: 6, component: '', route: 'dashboard/edit-escrow/add-ip'
    },

  ];

  steps: any[] = [];

  IncrementStep() {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
      return false;
    } else {
      return true;
    }
  }
  IsStepValue() {
    if (this.currentStep < this.steps.length) {
      return false;
    } else {
      return true;
    }
  }

  async GetEscrowDetails(_id: number) {
    const res = await this._ApiRequestService.PostDataAsync<{ escrow_id: number }, IEscrow>({ payload: { escrow_id: _id } }, apiRoutes.escrow.getEscrowDetails);
    if (res.statuscode != 200) {
      this._NgxToasterService.showError(res.message, 'Error')
      return;
    }
    if (!this.m_escrowDetails) {
      this.m_escrowDetails = new BehaviorSubject<IEscrow>(res.data);
    }
    this.m_escrowDetails?.next(res.data)
    return res.data;
  }


}
