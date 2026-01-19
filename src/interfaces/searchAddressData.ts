export interface SearchAddressResponse {
  Status: number;
  Data: SearchData[];
}

export interface SearchData {
  PostalCode: string;
  Address1: string;
  Address2: string;
  City: string;
}

export interface SearchParams {
  postCode: string;
  access_code: string;
}
