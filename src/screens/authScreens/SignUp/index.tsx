import React, {useEffect, useCallback} from 'react';
import {
  View,
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import useSignUp from './hooks/useSignUp';
import RenderInput from './components/InputContainer';
import {ROUTES} from '../../../constants/routeConstant';
import {registerSchema} from '../../../helpers/yupHelper';
import AppButton from '../../../components/button/AppButton';
import WelcomeLabel from '../../../components/welcomLabel/WelComelabel';
import {PLACEHOLDER, SIGN_UP} from '../../../constants/stringConstant';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import debounce from 'lodash.debounce';

const SignUp = () => {
  const {
    styles,
    control,
    onSubmit,
    handleSubmit,
    getValues,
    setError,
    emailErrorMessage,
    phoneErrorMessage,
    checkEmailExists,
    checkPhoneExists,
  } = useSignUp({
    schema: registerSchema,
  });

  const debouncedCheckForValid = useCallback(
    debounce(async (type) => {
      if (type === "e") {
        const email = getValues("emailAddress");
        await checkEmailExists(email, type, setError);
      } else if (type === "p") {
        const phone = getValues("telephone");
        await checkPhoneExists(phone, type, setError);
      }
    }, 3000),
    [],
  );

  const handleEmailChange = () => {
    debouncedCheckForValid("e");
  };

  const handlePhoneChange = () => {
    debouncedCheckForValid("p");
  };

  useEffect(() => {
    return () => {
      debouncedCheckForValid.cancel();
    };
  }, [debouncedCheckForValid]);

  return (
    <ImageBackground style={styles.container} source={{uri: 'auth_background'}}>
      <SafeAreaView style={styles.mainContainer}>
        <WelcomeLabel label={SIGN_UP.label} message={SIGN_UP.message} />
        <KeyboardAvoidingView
          style={styles.mainContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0}
        >
          <KeyboardAwareScrollView
            enableOnAndroid
            contentContainerStyle={styles.subContainer}
            keyboardShouldPersistTaps={"always"}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            contentInset={{bottom: 20}}>
            <RenderInput
              control={control}
              icon={"personIcon"}
              label={"First Name"}
              controllerName={"firstName"}
              maxLength={30}
              autoCapitalize={"words"}
              placeHolder={PLACEHOLDER.firstName}
              required
            />
            <RenderInput
              control={control}
              icon={"personIcon"}
              label={"Last Name"}
              controllerName={"lastName"}
              autoCapitalize={"words"}
              maxLength={30}
              placeHolder={PLACEHOLDER.lastName}
              required
            />
            <RenderInput
              control={control}
              icon={"emailIcon"}
              label={"Email Address"}
              keyboardType={"email-address"}
              controllerName={"emailAddress"}
              onChange={handleEmailChange}
              placeHolder={PLACEHOLDER.email}
              emailErrorMessage={emailErrorMessage}
              required
            />
            <RenderInput
              label={"Mobile"}
              control={control}
              icon={"phoneIcon"}
              type={"number"}
              keyboardType={"number-pad"}
              controllerName={"telephone"}
              onChange={handlePhoneChange}
              placeHolder={PLACEHOLDER.phone}
              emailErrorMessage={phoneErrorMessage}
              preFixCode={"+44"}
              maxLength={11}
              required
            />
            <RenderInput
              control={control}
              type={"password"}
              label={"Password"}
              controllerName={"password"}
              placeHolder={PLACEHOLDER.password}
              maxLength={50}
              required
            />
            <RenderInput
              control={control}
              type={"password"}
              label={"Confirm Password"}
              placeHolder={PLACEHOLDER.confirm}
              controllerName={"confirmPassword"}
              maxLength={50}
              required
            />
          </KeyboardAwareScrollView>
          <View style={styles.signUpButtonContainer}>
            <AppButton
              title="Next"
              labelStyle={styles.lableStyle}
              style={[styles.signUpButton, styles.button]}
              onPress={handleSubmit(() => onSubmit(ROUTES.businessInfo))}
              disabled={!!phoneErrorMessage || !!emailErrorMessage}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SignUp;
