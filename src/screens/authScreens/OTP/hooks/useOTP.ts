import cloneDeep from 'lodash/cloneDeep';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  emailSchema,
  otpEmailSchema,
  phoneSchema,
} from '../../../../helpers/yupHelper';
import {MODALS, ROUTES} from '../../../../constants/routeConstant';
import {RegisterParameter} from '../../../../interfaces/registerData';
import {appState, setRegistrationData} from '../../../../redux/app/appSlice';
import {closeModal, openModal, showToaster} from '../../../../helpers/utils';
import {
  useRegisterMutation,
  useSendOTPMutation,
  useSendSmsMutation,
  useVerifyOTPMutation,
} from '../../../../services/authService';
import { AppEventsLogger } from 'react-native-fbsdk-next';

interface onConfirm {
  data?: any;
  item: object;
  title?: string;
  type?: 'email' | 'phone';
  onConfirmPress: () => void;
}

const useOTP = () => {
  var sec = 120;
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [secondsEmail, setEmailSeconds] = useState(sec);
  const [secondsPhone, setPhoneSeconds] = useState(sec);
  const [inputType, setInputType] = useState<'email' | 'phone' | undefined>(
    undefined,
  );
  const emailIntervalRef = useRef<any>(null);
  const phoneIntervalRef = useRef<any>(null);
  const [sendOTP, {data: resendData}] = useSendOTPMutation();
  const checkData: RegisterParameter | any = useSelector(
    (state: {apps: appState}) => state.apps.registrationData,
  );
  const [register, {data: registerData}] = useRegisterMutation();
  const [verifyOTP, {data: verifyData}] = useVerifyOTPMutation();
  const [sendSMS, {data: sendSMSData}] = useSendSmsMutation();
  const contactEmail = checkData ? checkData?.emailAddress : '';
  const contactTelephone = checkData ? checkData?.telephone : '';

  const getSchema = useMemo(() => {
    if (inputType === 'email') {
      return emailSchema;
    }
    if (inputType === 'phone') {
      return phoneSchema;
    }
    return otpEmailSchema;
  }, [inputType]);

  const {handleSubmit, control, getValues, setValue, clearErrors} = useForm<
    any,
    any,
  >({
    resolver: getSchema,
    mode: 'all',
    defaultValues: {
      emailAddress: contactEmail || '',
      telephone: contactTelephone || '',
    },
  });

  const onOTPVerify = () => {
    navigation.navigate(ROUTES.otp);
  };

  const onCancelPress = (type: 'email' | 'phone' | undefined) => {
    setInputType(undefined);
    if (type === 'email') {
      setValue('emailAddress', contactEmail);
    }
    if (type === 'phone') {
      setValue('telephone', contactTelephone);
    }
    clearErrors();
    closeModal(MODALS.confirmation);
  };

  const onAddPress = ({item, title, onConfirmPress, type}: onConfirm) => {
    setInputType(type);
    openConfirmation({
      item,
      title,
      onConfirmPress,
      type,
    });
  };

  const openConfirmation = ({item, title, onConfirmPress, type}: onConfirm) => {
    openModal(MODALS.confirmation, {
      title: title,
      confirmLabel: 'Submit',
      subTitle: item,
      onPressCancel: () => onCancelPress(type),
      onPressConfirm: onConfirmPress,
    });
  };

  const onBackPress = () => navigation.goBack();

  const onVerifyPress = () => {
    verifyOTP({
      email: contactEmail,
      emailOtp: getValues('emailOTP'),
      smsOtp: getValues('telephoneOTP'),
      telephone: checkData.telephone,
    });
  };

  useEffect(() => {
    if (verifyData?.statusCode === 200) {
      register(checkData);
    }
  }, [checkData, register, verifyData]);

  useEffect(() => {
    if (registerData?.statusCode === 200) {
      AppEventsLogger.logEvent('user_register', {
        userId: registerData?.data,
      });
      showToaster(registerData?.message || '', 'S');
      navigation.navigate(ROUTES.login);
    }
  }, [navigation, registerData]);

  const onSubmitEmail = () => {
    const email = getValues?.()?.emailAddress;
    if (!email) {
      return;
    } else {
      const cloneData = cloneDeep(checkData);
      const newData = {
        ...cloneData,
        emailAddress: email,
        emailAddressVerify: email,
        contactEmailAddress: email,
      };
      dispatch(setRegistrationData(newData));
      sendOTP({
        email: email,
        lastName: checkData?.lastName,
        firstName: checkData?.firstName,
      });
      onCancelPress(undefined);
    }
  };

  const onSubmitTelephone = () => {
    const telephone = getValues?.()?.telephone;
    if (!telephone) {
      return;
    } else {
      const cloneData = cloneDeep(checkData);
      const newData = {
        ...cloneData,
        telephone: telephone,
      };
      dispatch(setRegistrationData(newData));
      sendSMS({
        mobileNo: telephone,
      });
      onCancelPress(undefined);
    }
  };

  const onResendOTP = () => {
    if (checkData?.emailAddress) {
      sendOTP({
        email: checkData?.emailAddress,
        firstName: checkData?.firstName,
        lastName: checkData?.lastName,
      });
    }
  };

  const onResentPhoneOTP = () => {
    if (checkData?.telephone) {
      sendSMS({
        mobileNo: checkData?.telephone,
      });
    }
  };

  const interval = useCallback(() => {
      emailIntervalRef.current = setInterval(() => {
        setEmailSeconds((prevSeconds: any) => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(emailIntervalRef.current);
  }, []);

  useEffect(() => {
    if (resendData?.statusCode === 200) {
      clearInterval(emailIntervalRef.current);
      setEmailSeconds(sec);
      interval();
      showToaster(resendData?.message, 'S');
    }
  }, [interval, resendData, sec]);

  const intervalSecond = useCallback(() => {
      phoneIntervalRef.current = setInterval(() => {
        setPhoneSeconds((prevSeconds: any) => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(phoneIntervalRef.current);
  }, []);

  useEffect(() => {
    if (sendSMSData?.statusCode === 200) {
      clearInterval(phoneIntervalRef.current);
      setPhoneSeconds(sec);
      intervalSecond()
      showToaster(sendSMSData?.message, 'S');
    }
  }, [sendSMSData, sec, intervalSecond]);

  useEffect(() => {
    interval();
  }, [interval]);

  useEffect(() => {
    intervalSecond();
  }, [intervalSecond]);

  useEffect(() => {
      if (secondsEmail === 0) {
        clearInterval(emailIntervalRef.current);
      }
  }, [secondsEmail]);

  useEffect(() => {
      if (secondsPhone === 0) {
        clearInterval(phoneIntervalRef.current);
      }
  }, [secondsPhone]);

  return {
    control,
    Controller,
    navigation,
    onAddPress,
    onResendOTP,
    onBackPress,
    handleSubmit,
    onOTPVerify,
    secondsPhone,
    setInputType,
    contactEmail,
    secondsEmail,
    onVerifyPress,
    onSubmitEmail,
    setPhoneSeconds,
    onResentPhoneOTP,
    contactTelephone,
    onSubmitTelephone,
    openConfirmation,
  };
};
export default useOTP;
