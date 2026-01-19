import React, {useState} from 'react';
import {SafeAreaView, ImageBackground} from 'react-native';
import {useSignUpStyle} from './styles';
import useSignUp from './hooks/useSignUp';
import {Controller} from 'react-hook-form';
import RenderInput from './components/InputContainer';
import {ROUTES} from '../../../constants/routeConstant';
import {businessInfoSchema} from '../../../helpers/yupHelper';
import AuthDropDown from '../../../components/textInput/AuthDropDown';
import WelcomeLabel from '../../../components/welcomLabel/WelComelabel';
import FooterButton from '../../../components/footerButton/FooterButton';
import {PLACEHOLDER, BUSINESS_CONTACT} from '../../../constants/stringConstant';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppText from '../../../components/text/AppText';

const BusinessInfo = () => {
  const {styles} = useSignUpStyle();
  const {
    control,
    onSubmit,
    authority,
    onBackPress,
    handleSubmit,
    onAddressPress,
  } = useSignUp({schema: businessInfoSchema});
  return (
    <ImageBackground style={styles.container} source={{uri: 'auth_background'}}>
      <SafeAreaView style={styles.mainContainer}>
        <WelcomeLabel
          label={BUSINESS_CONTACT.label}
          message={BUSINESS_CONTACT.message}
        />
        <KeyboardAwareScrollView style={styles.subContainer}>
          <RenderInput
            control={control}
            label={'Business Name'}
            icon={'businessNameIcon'}
            autoCapitalize={'words'}
            controllerName={'organisationName'}
            placeHolder={PLACEHOLDER.businessName}
            maxLength={50}
            required
          />

          <Controller
            control={control}
            name={'postcode'}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <AuthDropDown
                address
                icon={
                  <AppText style={styles.findAddress}>Find Address</AppText>
                }
                value={value}
                label={'Postcode'}
                onChange={() => {
                  onChange();
                }}
                isShowButton={false}
                style={styles.input}
                error={!value ? error?.message : ''}
                onSubmitPress={onAddressPress}
                titleStyle={styles.titleStyle}
                placeholder={PLACEHOLDER.postCode}
                required
              />
            )}
          />

          <RenderInput
            control={control}
            icon={'businessLogo'}
            autoCapitalize={'words'}
            label={'Business Address'}
            controllerName={'address1'}
            maxLength={50}
            placeHolder={PLACEHOLDER.businessAddress}
            required
          />

          <Controller
            control={control}
            name={'idAuthority'}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <AuthDropDown
                value={value}
                type={'radio'}
                item={authority}
                icon={'autherity'}
                label={'Authority'}
                onChange={onChange}
                error={error?.message}
                labelField={'authorityName'}
                placeholder={PLACEHOLDER.authority}
                titleStyle={styles.titleStyle}
                required
              />
            )}
          />
        </KeyboardAwareScrollView>
        <FooterButton
          labelStyles={styles.nextStyle}
          confirmLabel={'Next'}
          cancelLabel={'Previous'}
          onPressCancel={onBackPress}
          cancelStyle={styles.button}
          confrimStyle={styles.button}
          containerStyle={styles.buttonContainer}
          onPressConfirm={handleSubmit(() => onSubmit(ROUTES.businessDetails))}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};
export default BusinessInfo;
