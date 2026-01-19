export interface RegisterParameter {
  generalDescription?: string;
  isAllowShareDetails?: boolean;
  isAgreeTermCondition?: boolean;
  contactEmailAddress?: string;
  emailAddress?: string;
  emailAddressVerify?: string;
  firstName?: string;
  lastName?: string;
  telephone?: string;
  organisationName?: string;
  address1?: string;
  address2?: string;
  town?: string;
  postcode?: string;
  idAuthority?: number;
  idTrade?: number;
  idSubTrade?: number;
  subTradeId?: string;
  txtSubTradeId?: string;
}

export interface RegisterResponse {
  status: string;
  statusCode: number;
  message: string;
  data: string;
}
