import Svg from '../assets/svg';

export interface ProfileResponse {
  statusCode: number;
  message: string;
  data: ProfileData;
}

export interface ProfileData {
  idUser?: number;
  title?: string;
  userTitle?: string;
  firstName?: string;
  lastName?: string;
  telephone?: string;
  emailAddress?: string;
}

export interface ProfileOptions {
  id: number;
  // eslint-disable-next-line prettier/prettier
  icon: keyof typeof Svg;
  name: string;
}

export interface HonorificType {
  id: number;
  name: string;
}
