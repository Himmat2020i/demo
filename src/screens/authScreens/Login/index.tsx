import React, {useEffect} from 'react';
import {ImageBackground, Pressable, SafeAreaView, View} from 'react-native';
import {useLoginStyle} from './styles';
import AppButton from '../../../components/button/AppButton';
import Svg from '../../../assets/svg';
import AppText from '../../../components/text/AppText';
import useLogin from './hooks/useLogin';
import AuthTextInput from '../../../components/textInput/AuthTextInput';
import {LOG_IN, PLACEHOLDER} from '../../../constants/stringConstant';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Login = () => {
  const {styles} = useLoginStyle();
  const {
    control,
    Controller,
    onForgotPassPress,
    onSignUpPress,
    handleSubmit,
    getPermissions,
    handleLoginSubmit,
  } = useLogin();

  useEffect(() => {
    getPermissions();
  }, [getPermissions]);

  return (
    <ImageBackground style={styles.container} source={{uri: 'auth_background'}}>
      <SafeAreaView style={styles.mainContainer}>
        <KeyboardAwareScrollView style={styles.subContainer} bounces={false}>
          <View style={styles.logo}>
            <Svg.appLogo height={150} width={150} />
            <View style={styles.welcomeContainer}>
              <AppText style={styles.welcomeLabel}>Welcome to</AppText>
              <AppText style={styles.welcomeLabel}>UKTSA</AppText>
            </View>
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
                label="Email"
                placeholder={PLACEHOLDER.email}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                autoCorrect={true}
                textContentType="emailAddress"
                icon={'emailIcon'}
                returnKeyType="next"
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({
              field: {onChange, value, onBlur},
              fieldState: {error},
            }) => (
              <AuthTextInput
                style={styles.input}
                value={value}
                label="Password"
                placeholder={PLACEHOLDER.password}
                type={'password'}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                autoCorrect={false}
                textContentType="password"
              />
            )}
          />
          <AppButton
            labelStyle={styles.loginStyle}
            title="Login"
            onPress={handleSubmit(handleLoginSubmit)}
            style={styles.button}
          />
          <Pressable style={styles.forgetPass} onPress={onForgotPassPress}>
            <AppText style={styles.forgetPassText}>{LOG_IN.forgotPass}</AppText>
          </Pressable>
        </KeyboardAwareScrollView>
        <Pressable style={styles.signUp} onPress={onSignUpPress}>
          <AppText style={styles.signUpText}>{LOG_IN.message}</AppText>
          <AppText fontFamily="bold" style={styles.textUnderLine}>
            {LOG_IN.createAccount}
          </AppText>
        </Pressable>
      </SafeAreaView>
    </ImageBackground>
  );
};
export default Login;
