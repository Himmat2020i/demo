import { URLS } from "../constants/urlsConstant";
import { axiosBaseQuery } from "../redux/reduxUtils";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ForgotPassParams,
  ForgotPassResponse,
} from "../interfaces/authInterface/forgotPassword";
import {
  RegisterParameter,
  RegisterResponse,
} from "../interfaces/registerData";
import { CommonResponse } from "../interfaces/authInterface/commanResponse";
import {
  SendOTPPrams,
  SendSMSPrams,
  VerifyParams,
} from "../interfaces/authInterface/otp";

const authApi = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: "auth",
  endpoints: (builder) => ({
    login: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: URLS.login,
          method: "POST",
          data,
          silent: true,
        };
      },
    }),
    schemeRowData: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: URLS.schemeRowData,
          method: "POST",
          data,
          silent: true,
        };
      },
    }),
    businessScheme: builder.query<any, any>({
      query: () => {
        return {
          url: URLS.businessScheme,
          method: "GET",
          silent: true,
        };
      },
    }),

    businessInfo: builder.query<any, any>({
      query: () => {
        return {
          url: URLS.businessInfo,
          method: "GET",
          silent: true,
        };
      },
    }),

    createAnswer: builder.query<any, any>({
      query: (data) => {
        return {
          url: URLS.createAnswer,
          method: "POST",
          data,
          silent: true,
        };
      },
    }),

    submitApplication: builder.query<any, any>({
      query: (data) => {
        return {
          url: URLS.submitApplication,
          method: "POST",
          data,
        };
      },
    }),

    register: builder.mutation<RegisterResponse, RegisterParameter>({
      query: (data) => {
        return {
          url: URLS.register,
          method: "POST",
          data,
        };
      },
    }),

    switchBusiness: builder.query<any, any>({
      query: (data) => {
        return {
          url: URLS.switchBusiness.replace("{bid}", data.toString()),
          method: "POST",
          data,
        };
      },
    }),

    refreshToken: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: URLS.refreshToken,
          method: "POST",
          data,
        };
      },
    }),

    sendSms: builder.mutation<CommonResponse, SendSMSPrams>({
      query: (data) => {
        return {
          url: URLS.sendSms,
          method: "POST",
          data,
          silent: false,
        };
      },
    }),

    sendOTP: builder.mutation<CommonResponse, SendOTPPrams>({
      query: (data) => {
        return {
          url: URLS.sendMail,
          method: "POST",
          data,
          silent: false,
        };
      },
    }),

    getAndPostProfile: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: URLS.getAndPostProfile,
          method: data ? "POST" : "GET",
          data,
        };
      },
    }),

    verifyOTP: builder.mutation<CommonResponse, VerifyParams>({
      query: (data) => {
        return {
          url: URLS.verifyEmail,
          method: "POST",
          data,
        };
      },
    }),

    forgotPassword: builder.mutation<ForgotPassResponse, ForgotPassParams>({
      query: (data) => {
        return {
          url: URLS.forgotPassword,
          method: "POST",
          data,
          silent: false,
        };
      },
    }),

    emailExists: builder.mutation<CommonResponse, SendOTPPrams>({
      query: (data) => {
        return {
          url: URLS.emailExists,
          method: "POST",
          data,
          silent: true,
        };
      },
    }),
    deleteUser: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: URLS.deleteUser,
          method: "POST",
          data,
          silent: true,
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLazyBusinessInfoQuery,
  useRefreshTokenMutation,
  useLazyCreateAnswerQuery,
  useSchemeRowDataMutation,
  useLazySwitchBusinessQuery,
  useLazySubmitApplicationQuery,
  useGetAndPostProfileMutation,
  useSendOTPMutation,
  useRegisterMutation,
  useVerifyOTPMutation,
  useForgotPasswordMutation,
  useLazyBusinessSchemeQuery,
  useEmailExistsMutation,
  useSendSmsMutation,
  useDeleteUserMutation,
} = authApi;

export default authApi;
