import React from 'react';
import {View, ImageBackground} from 'react-native';
import Svg from '../../assets/svg';
import AppText from '../../components/text/AppText';
import {useOnboardingStyle} from './styles';
import AppButton from '../../components/button/AppButton';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../constants/routeConstant';
import {ONBOARD} from '../../constants/stringConstant';

const Onboarding = () => {
  const {styles} = useOnboardingStyle();
  const navigation = useNavigation<any>();

  const onLoginPress = () => navigation.navigate(ROUTES.login);
  const onSignUpPress = () => navigation.navigate(ROUTES.signUp);

  return (
    <ImageBackground style={styles.container} source={{uri: 'auth_background'}}>
      <View style={styles.iconContainer}>
        <Svg.appLogo height={200} width={200} />
        <View style={styles.welcomeContainer}>
          <AppText fontFamily={'bold'} style={styles.welcomeLabel}>
            {ONBOARD.label}
          </AppText>
          <AppText style={styles.welcomeSubLabel}>{ONBOARD.message}</AppText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          title={'Sign in'}
          onPress={onLoginPress}
          style={styles.signInButton}
          labelStyle={styles.signInLabel}
        />
        <AppButton
          title={'Create an Account'}
          onPress={onSignUpPress}
          style={styles.signUpButton}
        />
      </View>
    </ImageBackground>
  );
};

export default Onboarding;
