export interface RouteInterface {
  [index: string]: string;
}

export const ROUTES = {
  otp: "Otp",
  app: "App",
  auth: "Auth",
  home: "Home",
  login: "Login",
  splash: "Splash",
  signUp: "Sign Up",
  details: "Details",
  onboard: "Onboard",
  profile: "Profile",
  htmlRender: "HTML Render",
  businessInfo: "Business Info",
  addDocuments: "Add Documents",
  documentList: "Document Monitor",
  forgotPassword: "Forgot Password",
  selectBusiness: "Select Business",
  changePassword: "Change Password",
  businessDetails: "Business Details",
  changePasswordSuccess: "Change Password Success",
};

export const MODALS = {
  loader: "Loader",
  network: "Network",
  confirmation: "Confirmation",
  alertMessage: "AlertMessage",
  bottomSheet: "BottomSheet",
  reasonTextInput: "ReasonTextInput",
};
