/* eslint-disable no-control-regex */
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { isValidNumber } from "react-native-phone-number-input";
import { REQUIRED, VALID } from "../constants/stringConstant";
import { EMAIL_REGEX } from "../constants/constants";

export const loginFormSchema = yupResolver(
  yup
    .object({
      email: yup.string().email(VALID.email).required(REQUIRED.email)
      .matches(EMAIL_REGEX, VALID.email),
      password: yup
        .string()
        .trim()
        .required(REQUIRED.password)
        .matches(/^[\x00-\x7F]+$/, VALID.password),
    })
    .required()
);

export const deleteAccountSchema = yupResolver(
  yup
    .object({
      reason: yup.string().required(REQUIRED.deleteAccountReason).min(5, VALID.deleteAccountReason)
    })
    .required()
);

export const forgotPassSchema = yupResolver(
  yup
    .object({
      email: yup.string().email(VALID.email).required(REQUIRED.email),
    })
    .required()
);

export const registerSchema = yupResolver(
  yup
    .object({
      firstName: yup.string().required(REQUIRED.firstName).matches(/^[A-Za-z ]+$/, VALID.firstNameFormat),

      lastName: yup.string().required(REQUIRED.lastName).matches(/^[A-Za-z ]+$/, VALID.lastNameFormat),
      emailAddress: yup
        .string()
        .email(VALID.email)
        .required(REQUIRED.emailAddress)
        .matches(EMAIL_REGEX, VALID.email)
        .test(
          "unique-email",
          "This email address is already in use.",
          async function (value) {
            return true;
          }
        ),

      contactEmailAddress: yup.string().default("emailAddress"),

      emailAddressVerify: yup.string().default("emailAddress"),

      telephone: yup
        .string()
        .required(REQUIRED.phone)
        .test(
          "unique-phone",
          "This mobile number is already in use.",
          async function (value) {
            return true;
          }
        )

        .test("customValidation", VALID.phone, (value: string) => {
          return isValidNumber(value, "GB");
        }),
      password: yup
        .string()
        .trim()
        .required(REQUIRED.password)
        .min(8, VALID.passLimit)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,50}$/,
          VALID.specialChar
        ),
      confirmPassword: yup
        .string()
        .trim()
        .required(REQUIRED.confirmPass)
        .oneOf([yup.ref("password")], VALID.confrimPassMatch)
        .matches(/^[\x00-\x7F]+$/, VALID.password),
    })
    .required()
);

export const otpEmailSchema = yupResolver(
  yup.object({
    emailOTP: yup
      .string()
      .required(REQUIRED.emailOTP)
      .test("unique-email", "Invalid OTP", (value) => {
        if (value.length === 6) {
          return true;
        } else {
          return false;
        }
      }),
    telephoneOTP: yup
      .string()
      .required(REQUIRED.phoneOTP)
      .test("unique-phone", "Invalid OTP", (value) => {
        if (value.length === 6) {
          return true;
        } else {
          return false;
        }
      }),
  })
);

export const phoneSchema = yupResolver(
  yup.object({
    telephone: yup
      .string()
      .required(REQUIRED.phone)
      .test("unique-phone", "This mobile number is already in use.", (value) => {
        if (value) {
          return true;
        } else {
          return false;
        }
      })
      .test("customValidation", VALID.phone, (value: string) => {
        return isValidNumber(value, "GB");
      }),
  })
);

export const emailSchema = yupResolver(
  yup.object({
    emailAddress: yup.string().email(VALID.email).required(REQUIRED.email),
  })
);

export const businessInfoSchema = yupResolver(
  yup
    .object({
      organisationName: yup.string().required(REQUIRED.businessName),

      address1: yup.string().required(REQUIRED.businessAddress),

      address2: yup.string(),

      town: yup.string(),

      postcode: yup.string().required(REQUIRED.postCode),

      idAuthority: yup.number().required(REQUIRED.authority),
    })
    .required()
);

export const businessDetailsSchema = yupResolver(
  yup
    .object()
    .shape({
      idTrade: yup.number().required(REQUIRED.trade),

      subTradeIds: yup.array(),

      generalDescription: yup.string().required(REQUIRED.companyInfo),
    })
    .required()
);

export const detailSchema = yup.object().shape({
  QuestionsID: yup
    .array()
    .of(yup.string().trim().required(REQUIRED.insertSomthing))
    .min(1, REQUIRED.input),
});

export const profileFormSchema = yupResolver(
  yup
    .object({
      title: yup.string().required(REQUIRED.honorific),
      firstName: yup.string().trim().required(REQUIRED.firstName).matches(/^[A-Za-z ]+$/, VALID.firstNameFormat),
      lastName: yup.string().trim().required(REQUIRED.lastName).matches(/^[A-Za-z ]+$/, VALID.lastNameFormat),
      emailAddress: yup.string().email(VALID.email).required(REQUIRED.email),
      telephone: yup
        .string()
        .trim()
        .required(REQUIRED.telephone)
        .test("customValidation", VALID.phone, (value: string) => {
          return isValidNumber(value, "GB");
        }),
    })
    .required()
);

export const changePasswordFormSchema = yupResolver(
  yup
    .object({
      oldPassword: yup
        .string()
        .trim()
        .required(REQUIRED.currentPassword)
        .min(8, VALID.passLimit)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
          VALID.specialChar
        ),
      password: yup
        .string()
        .trim()
        .required(REQUIRED.password)
        .min(8, VALID.passLimit)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
          VALID.specialChar
        ),
      confirmPassword: yup
        .string()
        .trim()
        .required(REQUIRED.confirmPass)
        .oneOf([yup.ref("password")], VALID.confrimPassMatch)
        .matches(/^[\x00-\x7F]+$/, VALID.password),
    })
    .required()
);

export const addDocumentFormSchema = yupResolver(
  yup
    .object({
      document: yup
        .object()
        .shape({
          uri: yup.string().required(),
          name: yup.string().required(),
          type: yup.string().required(),
        })
        .test("custom", REQUIRED.document, (value) => {
          if (value.uri && value.name) {
            return true;
          } else {
            return false;
          }
        })
        .required(REQUIRED.document),
      documentExpiryDate: yup.string().trim().required(REQUIRED.expiryDate),
      idMonitorDocumentType: yup
        .string()
        .trim()
        .required("Document name is required."),
      description: yup.string(),
    })
    .required()
);
