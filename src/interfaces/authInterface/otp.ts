export interface SendOTPPrams {
  email: string;
  firstName: string;
  lastName: string;
}

export interface VerifyParams {
  email: string;
  emailOtp: string;
  smsOtp: string;
  telephone: string;
}

export interface SendSMSPrams {
  mobileNo: string;
}
