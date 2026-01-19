import {useCallback, useEffect, useRef, useState} from 'react';
import {Controller, useForm, useWatch} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {COMMON_STRING, REQUIRED} from '../../../../constants/stringConstant';
import {
  getFileNameFromUrl,
  onFileOpen,
  openModal,
  showToaster,
} from '../../../../helpers/utils';
import {MODALS, ROUTES} from '../../../../constants/routeConstant';
import {useBundleRegisterDataQuery} from '../../../../services/appServices';
import {appState, setRegistrationData} from '../../../../redux/app/appSlice';
import {
  useSendOTPMutation,
  useEmailExistsMutation,
  useSendSmsMutation,
} from '../../../../services/authService';
import {useSignUpStyle} from '../styles';
import {SearchData} from '../../../../interfaces/searchAddressData';
import {
  Scheme,
  SubTrade,
  TermsList,
  Trade,
} from '../../../../interfaces/bundleRegisterData';
interface useSignHook {
  route?: any;
  schema?: any;
}

interface bottomaSheetPress {
  value?: any;
  item?: any[];
  nameKey?: string;
  onSubmitPress?: () => void;
  onChange?: (item: any) => void;
  type?: 'radio' | 'check' | undefined;
  dropdown?: 'single' | 'multiple' | undefined;
}

const useSignUp = ({schema}: useSignHook) => {
  const iconRef = useRef(null);
  const dispatch = useDispatch();
  const {styles} = useSignUpStyle();
  const navigation = useNavigation<any>();
  const [tradeId, setTradeId] = useState();
  const {data} = useBundleRegisterDataQuery();
  const [trade, setTrade] = useState<Trade[]>([]);
  const [isShowInfo, setShowInfo] = useState(false);
  const [selectedId, setSelectedId] = useState<any[]>([]);
  const [subTrade, setSubTrade] = useState<SubTrade[]>([]);
  const [authority, setAuthority] = useState<Scheme[]>([]);
  const [termsList, setTermsList] = useState<TermsList[]>([]);

  const [sendSMS, {data: sendSMSData}] = useSendSmsMutation();

  const [sendOTP, {data: sendOTPData}] = useSendOTPMutation();
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
  const [sendEmail, {data: sendEmailData}] = useEmailExistsMutation();

  const checkData: any = useSelector(
    (state: {apps: appState}) => state.apps.registrationData,
  );

  const {handleSubmit, control, setValue, getValues, reset, setError} = useForm<
    any,
    any,
  >({
    resolver: schema,
    mode: 'onBlur',
  });

  const isTradeSelected = useWatch({
    control,
    name: "idTrade",
  });

  const setRegisterData = useCallback(() => {
    setTrade(data?.data?.trades || []);
    setAuthority(data?.data?.schemes || []);
    setTermsList(data?.data?.termsList || []);
  }, [data]);

  const checkEmailExists = async email => {
    try {
      const response = await sendEmail({
        type: 'email',
        email: email,
      });
      if (response.data?.data?.data) {
        const emailError = response.data.message;
        setEmailErrorMessage(emailError);
      } else {
        setEmailErrorMessage('');
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  const checkPhoneExists = async phone => {
    try {
      let number = phone;
      if (phone?.[0] === 0 || phone?.[0] === '0') {
        number = phone?.slice(1, phone?.length + 1);
        setValue('telephone', number);
      }
      if (number?.length < 10) {
        return;
      }
      const response = await sendEmail({
        type: 'phone',
        telephone: number,
      });
      if (response.data?.data?.data) {
        const phoneError = response.data.message;
        setPhoneErrorMessage(phoneError);
      } else {
        setPhoneErrorMessage('');
      }
    } catch (error) {
      console.error('Error checking phone:', error);
    }
  };

  useEffect(() => {
    setRegisterData();
  }, [setRegisterData]);

  const onBackPress = () => navigation.goBack();

  const onBottomSheet = ({
    type,
    item,
    value,
    nameKey,
    onChange,
    dropdown,
    onSubmitPress,
  }: bottomaSheetPress) => {
    openModal(MODALS.bottomSheet, {
      type: type,
      item: item,
      value: value,
      nameKey: nameKey,
      dropdown: dropdown,
      onChange: onChange,
      onSubmitPress: onSubmitPress,
    });
  };

  const onTradeSubmit = (value: any) => {
    const cloneData: SubTrade[] = data?.data?.subTrades
      ? data?.data?.subTrades?.filter((i: SubTrade) => i?.idTrade === value)
      : [];
    const subTradeData = getValues('subTradeIds');
    if (value) {
      setSubTrade?.(cloneData);
      if (subTradeData) {
        if (tradeId !== value) {
          setValue('subTradeIds', []);
          setTradeId(value);
        }
      } else {
        setTradeId(value);
      }
    }
  };
  const onNextPress = () => {
    const email = getValues('emailAddress');

    setValue('emailAddressVerify', email);
    setValue('contactEmailAddress', email);
    return handleSubmit(() => onSubmit(ROUTES.businessInfo));
  };

  const onSubmit = (route?: any) => {
    if (checkData) {
      setValue('emailAddressVerify', checkData?.emailAddress || '');
      setValue('contactEmailAddress', checkData?.emailAddress || '');
    }
    const updatedData = {
      ...checkData,
      ...getValues(),
    };
    dispatch(setRegistrationData(updatedData));
    let isError: boolean = false;
    if (route) {
      navigation.navigate(route);
      return;
    } else {
      if (data?.data?.termsList?.length) {
        isError = data.data.termsList.every((item: any) => {
          if (!getValues()?.[item?.value]) {
            showToaster(REQUIRED.checkBox, 'E');
            return false;
          } else {
            return true;
          }
        });
      }
      if (isError) {
        sendSMS({
          mobileNo: updatedData.telephone,
        });
        sendOTP({
          email: updatedData?.emailAddress,
          firstName: updatedData?.firstName,
          lastName: updatedData?.lastName,
        });
      }
    }
  };

  useEffect(() => {
    if (sendOTPData?.statusCode === 200) {
      // showToaster(sendOTPData?.message, "S");
      showToaster('Otp send sucessfully Please check.', 'S');
      navigation.navigate(ROUTES.otp);
      return;
    }
  }, [navigation, sendOTPData]);

  const handleCheck = (item: any) => {
    if (selectedId.some((checkedItem: any) => checkedItem === item?.value)) {
      setSelectedId(prevItems =>
        prevItems?.filter((prevItem: any) => prevItem !== item?.value),
      );
    } else {
      setSelectedId(prevItems => [...prevItems, item?.value]);
      const check = selectedId?.some((i: any) => i === item?.value);
      setValue(item?.value, check);
    }
  };

  const handlePress = async (url: string, fileName: string) => {
    await onFileOpen(url, fileName || '');
  };

  const onTermsPress = (item: TermsList) => {
    if (item?.type === 'html') {
      return navigation.navigate(ROUTES.htmlRender, {
        html: item,
        title: COMMON_STRING.privacyPol,
      });
    } else {
      const fileName = getFileNameFromUrl(item?.content);
      return handlePress?.(item?.content, fileName || '');
    }
  };

  const onAddressPress = (item?: SearchData) => {
    const address: string =
      item?.Address1 + ' ' + item?.Address2 + ' ' + item?.City || '';
    setValue('postcode', item?.PostalCode || '');
    setValue('address2', item?.Address2 || '');
    setValue('address1', address.trim() || '', {shouldValidate: true});
    setValue('town', item?.City || '');
  };

  const onFindAddress = (value: string, onChange: () => void) => {
    openModal(MODALS.bottomSheet, {
      type: 'radio',
      value: value,
      address: true,
      onChange: onChange,
      onSubmitPress: onAddressPress,
      isShowButton: false,
    });
  };
  const setManualEmailError = (message: string) => {
    setError('emailAddress', {
      type: 'manual',
      message: message,
    });
  };
  return {
    trade,
    reset,
    styles,
    iconRef,
    control,
    subTrade,
    onSubmit,
    setValue,
    termsList,
    getValues,
    authority,
    selectedId,
    navigation,
    Controller,
    isShowInfo,
    setShowInfo,
    handleCheck,
    setSubTrade,
    onBackPress,
    onNextPress,
    onTermsPress,
    handleSubmit,
    onBottomSheet,
    onTradeSubmit,
    onFindAddress,
    onAddressPress,
    setError,
    setManualEmailError,
    emailErrorMessage,
    phoneErrorMessage,
    checkEmailExists,
    checkPhoneExists,
    isTradeSelected,
  };
};
export default useSignUp;
