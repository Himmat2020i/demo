export interface bundleRegisterDataResponse {
  statusCode: number;
  message: string;
  data: BundleRegisterData;
}

export interface BundleRegisterData {
  addressbyPostCode: string;
  schemes: Scheme[];
  trades: Trade[];
  subTrades: SubTrade[];
  termsList: TermsList[];
}

export interface Scheme {
  id: number;
  authorityName: string;
}

export interface Trade {
  id: number;
  tradeName: string;
}

export interface SubTrade {
  id: number;
  idTrade: number;
  subTradeName: string;
}

export interface TermsList {
  title: string;
  type: string;
  content: string;
  value: string;
  isoptional: boolean;
}
