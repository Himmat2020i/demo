import React, {useCallback} from 'react';
import {
  Platform,
  SafeAreaView,
  ImageBackground,
  InputModeOptions,
  KeyboardAvoidingView,
} from 'react-native';
import useOTP from './hooks/useOTP';
import {useOTPStyle} from './styles';
import OtpInput from './components/otpInput';
import AppButton from '../../../components/button/AppButton';
import AppTextInput from '../../../components/textInput/AppTextInput';
import WelcomeLabel from '../../../components/welcomLabel/WelComelabel';
import {
  PLACEHOLDER,
  VERIFICATION_CODE,
} from '../../../constants/stringConstant';

interface render {
  placeHolder?: string;
  controllerName: string;
  inputMode?: InputModeOptions | undefined;
}

const OTP = () => {
  const {styles} = useOTPStyle();
  const {
    secondsEmail,
    secondsPhone,
    control,
    onAddPress,
    Controller,
    onResendOTP,
    onResentPhoneOTP,
    contactEmail,
    onVerifyPress,
    handleSubmit,
    onSubmitEmail,
    contactTelephone,
    onSubmitTelephone,
    setInputType,
  } = useOTP();

  const renderInput = useCallback(
    ({placeHolder, inputMode, controllerName}: render) => (
      <Controller
        control={control}
        name={controllerName}
        render={({field: {onChange, value, onBlur}, fieldState: {error}}) => (
          <AppTextInput
            value={value}
            onBlur={onBlur}
            inputMode={inputMode}
            onChangeText={onChange}
            style={styles.inputConfirm}
            error={error?.message || ''}
            textStyle={styles.textStyles}
            placeholder={placeHolder || ''}
            keyboardType={
              controllerName === 'telephone' ? 'phone-pad' : 'email-address'
            }
          />
        )}
      />
    ),
    [Controller, control, styles],
  );

  const onEmailOTP = () => {
    onAddPress({
      type: 'email',
      item: renderInput({
        controllerName: 'emailAddress',
        placeHolder: PLACEHOLDER.email,
        inputMode: 'email',
      }),
      title: 'Email Address',
      onConfirmPress: handleSubmit(onSubmitEmail),
    });
  };

  const onTelephoneOTP = () => {
    setInputType('phone');
    onAddPress({
      type: 'phone',
      item: renderInput({
        controllerName: 'telephone',
        placeHolder: PLACEHOLDER.telephone,
        inputMode: 'numeric',
      }),
      title: 'Mobile Number',
      onConfirmPress: handleSubmit(onSubmitTelephone),
    });
  };

  return (
    <ImageBackground style={styles.container} source={{uri: 'auth_background'}}>
      <SafeAreaView style={styles.container}>
        <WelcomeLabel
          label={VERIFICATION_CODE.label}
          message={VERIFICATION_CODE.message}
        />
        <KeyboardAvoidingView
          style={styles.subContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <OtpInput
            time={secondsEmail}
            control={control}
            label="Email OTP"
            onResend={onResendOTP}
            onEditPress={onEmailOTP}
            contactInfo={contactEmail}
            controllerName={'emailOTP'}
          />
          <OtpInput
            time={secondsPhone}
            control={control}
            label="Mobile OTP"
            onResend={onResentPhoneOTP}
            onEditPress={onTelephoneOTP}
            contactInfo={contactTelephone}
            controllerName={'telephoneOTP'}
          />
        </KeyboardAvoidingView>
        <AppButton
          style={styles.button}
          labelStyle={styles.varifyStyle}
          onPress={handleSubmit(onVerifyPress)}
          title={'Verify & Proceed'}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};
export default OTP;
