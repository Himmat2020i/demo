import {
  View,
  Platform,
  Pressable,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import Svg from '../../../assets/svg';
import AppText from '../../../components/text/AppText';
import useForgotPassword from './hooks/useForgotPassword';
import AppButton from '../../../components/button/AppButton';
import AuthTextInput from '../../../components/textInput/AuthTextInput';
import {FORGOT_PASSWORD, PLACEHOLDER} from '../../../constants/stringConstant';

const ForgotPassword = () => {
  const {
    goBack,
    styles,
    colors,
    control,
    Controller,
    handleSubmit,
    onSubmitPress,
  } = useForgotPassword();

  return (
    <ImageBackground style={styles.container} source={{uri: 'auth_background'}}>
      <SafeAreaView style={styles.mainContainer}>
        <KeyboardAvoidingView
          style={styles.subContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable hitSlop={15} onPress={goBack} style={styles.iconContainer}>
            <Svg.backIcon fill={colors.white} width={18} height={18} />
          </Pressable>
          <View style={styles.logo}>
            <Svg.appLogo height={150} width={150} />
          </View>
          <View style={styles.forgotPass}>
            <AppText style={styles.forgotPasslabel}>
              {FORGOT_PASSWORD.label}
            </AppText>
            <AppText style={styles.forgotPassSublabel}>
              {FORGOT_PASSWORD.message}
            </AppText>
          </View>
          <Controller
            control={control}
            name="email"
            render={({
              field: {onChange, value, onBlur},
              fieldState: {error},
            }) => (
              <AuthTextInput
                value={value}
                label={'Email'}
                onBlur={onBlur}
                icon={'emailIcon'}
                autoCorrect={false}
                error={error?.message}
                onChangeText={onChange}
                textContentType={'username'}
                textStyle={styles.inputText}
                placeholder={PLACEHOLDER.email}
              />
            )}
          />
          <AppButton
            title="Submit"
            style={styles.button}
            onPress={handleSubmit(() => onSubmitPress())}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ForgotPassword;
