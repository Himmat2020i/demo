import React from 'react';
import {useOTPStyle} from '../styles';
import Svg from '../../../../assets/svg';
import {Pressable, View} from 'react-native';
import AppText from '../../../../components/text/AppText';
import OtpInputs from 'react-native-otp-inputs';
import {VERIFICATION_CODE} from '../../../../constants/stringConstant';
import {Controller} from 'react-hook-form';

interface Props {
  control?: any;
  time?: number;
  label?: string;
  contactInfo?: string;
  onResend?: () => void;
  controllerName: string;
  onEditPress?: () => void;
}

const OtpInput = React.memo(
  ({
    time,
    label,
    control,
    onResend,
    onEditPress,
    contactInfo,
    controllerName,
  }: Props) => {
    const {styles, colors} = useOTPStyle();
    const isDisable = (time || 0) > 0;
    return (
      <View>
        <View style={styles.labelContainer}>
          <AppText style={styles.label}>
            {label || ''}
            <AppText style={styles.labelType}> {contactInfo || ''}</AppText>
          </AppText>
          <Pressable onPress={onEditPress}>
            <Svg.editIcon height={18} width={18} fill={colors.white} />
          </Pressable>
        </View>
        <Controller
          control={control}
          name={controllerName}
          render={({field: {onChange}, fieldState: {error}}) => (
            <>
              <OtpInputs
                inputMode="tel"
                placeholder={'*'}
                style={styles.otp}
                numberOfInputs={6}
                handleChange={onChange}
                inputStyles={styles.input}
                keyboardType={'phone-pad'}
                returnKeyType={'done'}
                focusStyles={styles.onFocus}
                autofillFromClipboard={false}
                selectionColor={colors.primary}
                placeholderTextColor={colors.white}
                inputContainerStyles={styles.inputContainer}
              />
              {error && (
                <AppText style={styles.error}>{error?.message}</AppText>
              )}
            </>
          )}
        />

        <View style={styles.resendContainer}>
          <AppText fontFamily="bold" style={styles.resend}>
            {VERIFICATION_CODE.resend}
          </AppText>
          <Pressable onPress={onResend} disabled={isDisable}>
            <AppText
              fontFamily="bold"
              style={[
                styles.resend,
                {color: isDisable ? colors.glaciarGray : colors.white},
              ]}>
              {VERIFICATION_CODE.resendButton}
            </AppText>
          </Pressable>
          {(time || 0) > 0 && (
            <AppText style={styles.second}>{`${time} Sec`}</AppText>
          )}
        </View>
      </View>
    );
  },
);

export default OtpInput;
