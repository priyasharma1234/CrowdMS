import { IGenericApiResponse,IHeader } from "src/app/types/global"


export type IAgreement = {
  id: number
  escrow_id: number
  type: string
  document_path: string,
  signing_date: string
  effective_date: string
  expiry_date: string
  additional_docs: string
  created_at: string
  updated_at: string
}
export type IPhysicalDeposit = {
 id: number
  escrow_id: number
  depositor_name: string
  depositor_mobile: string
  device: string
  submit_date: string
  primary_location: string
  vault_number: string
  kyc: string
  remarks: any
  device_picture: string
  packaging_picture: string
  other_picture: string
  other_documentation: string
  created_at: string
  updated_at: string
}


export type IEscrow = {
  release: { ip_address: {address: string; remarks: string }[], reason: string};
  id: number,
  escrow_id: string,
  escrow_type: 'Software' | 'Physical',
  depositor_id: number,
  depositor_representative: string,
  beneficiary_id: number,
  beneficiary_representative: string,
  start_date: string,
  expiry_date: string,
  status: number,
  stage: string,
  user_type: 'depositor' | 'beneficiary',
  created_at: string,
  updated_at: string,
  depositor: {
    id: number,
    company_name: string,

    corporate_details: ICorporateDetails
  },
  beneficiary: {
    id: number,
    company_name: string,
    corporate_details: ICorporateDetails
  },
  deposit: {
    ip_address: {
      address: string,
      remarks: string
    }[],
  },
  agreement: IAgreement,
  software_deposit: ISoftwareDeposit[],
  physical_deposit:IPhysicalDeposit
}
export type ICorporateDetails = {
  id: number
  corpid: number
  company_name: string
  company_pan: string
  company_cin: string
  company_address: string
  rep_name: string
  rep_email: string
  rep_mobile: string
  remark: string
  rep_alt_mobile: string | null
  rep_profile_pic: string
  status: string
  created_by: number
  created_at: string
  updated_at: string
}
export type ISoftwareDeposit = {
  id: number,
  escrow_id: number,
  upload_type: string,
  source_code: string,
  auto_deposit: null,
  source_code_hash: null,
  additional_documents: [
    {
      name: string,
      url: string
    }
  ],
  certificates: {
    [key: string]: {
      name: string,
      url: string
    },
  },
  verification: {
    [key: string]: {
      name: string,
      url: string
      status: string
    }
  },
  status: string,
  version: string,
  created_at: string,
  updated_at: string
}

export type IEscrowApiResponse = IGenericApiResponse<IEscrow[]> & {
  header: IHeader[];
};
