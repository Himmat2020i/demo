import React, {ReactNode, useState} from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleProp,
  TextStyle,
  ViewStyle,
  TextInputProps,
  PressableStateCallbackType,
} from 'react-native';
import {useTheme} from '../../hooks';
import AppText from '../text/AppText';
import SvgIcon from '../../assets/svg';
import {useAppTextInputStyle} from './AppTextInputStyle';

interface props extends TextInputProps {
  label?: string;
  inputRef?: any;
  prefix?: string;
  required?: boolean;
  leftIcon?: JSX.Element;
  floatingLabel?: boolean;
  error?: string | undefined;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  leftIconStyle?: StyleProp<ViewStyle>;
  onIconPress?: () => void | undefined;
  rightIconStyle?: StyleProp<ViewStyle>;
  floatingLabelStyle?: StyleProp<TextStyle>;
  autoCapitalize?: 'characters' | 'words' | 'sentences' | 'none';
  icon?: ReactNode | ((state: PressableStateCallbackType) => ReactNode);
  type?: 'password' | 'number' | 'email' | 'phone' | 'text' | 'percentage';
}

const AppTextInput = ({
  icon,
  type,
  error,
  style,
  label,
  value,
  prefix,
  onBlur,
  onFocus,
  required,
  leftIcon,
  inputRef,
  textStyle,
  onPressIn,
  labelStyle,
  onIconPress,
  placeholder,
  autoCorrect,
  onChangeText,
  leftIconStyle,
  floatingLabel,
  rightIconStyle,
  textContentType,
  placeholderTextColor,
  autoCapitalize = 'none',
  floatingLabelStyle = {},
  ...rest
}: props) => {
  const styles = useAppTextInputStyle({leftIcon, editable: rest?.editable});
  const {colors} = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(
    type === 'password',
  );
  const handleOnBlur = () => {
    if (!value) {
      setIsFocused(false);
    }
  };
  const onFocusInput = () => {
    setIsFocused(true);
  };
  const handlePasswordIcon = () => {
    setSecureTextEntry(prev => !prev);
  };

  const getKeyboardType = () => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'number':
        return 'numeric';
      case 'phone':
        return 'phone-pad';
      case 'percentage':
        return 'numeric';
      default:
        return 'default';
    }
  };

  return (
    <>
      {label && !floatingLabel ? (
        <AppText style={[styles.label, labelStyle]}>
          {label}
          {required ? (
            <AppText style={[styles.label, styles.required]}>*</AppText>
          ) : null}
        </AppText>
      ) : null}
      <View
        style={[
          styles.container,
          style,
          error ? styles.errorWrapper : {},
          prefix ? styles.prefixContainer : {},
        ]}>
        {(label && floatingLabel && value) || isFocused ? (
          <AppText style={[styles.floatingLabel, floatingLabelStyle]}>
            {label}
          </AppText>
        ) : null}
        {leftIcon ? (
          <View style={[styles.leftIcon, leftIconStyle]}>{leftIcon}</View>
        ) : null}
        {prefix ? (
          <View style={styles.auroView}>
            <AppText style={styles.prefixTextStyles}>{prefix}</AppText>
          </View>
        ) : null}
        <TextInput
          onBlur={e => {
            if (onBlur) {
              onBlur(e);
            } else {
              if (floatingLabel) {
                handleOnBlur();
              }
            }
          }}
          ref={inputRef}
          keyboardType={getKeyboardType()}
          placeholder={
            floatingLabel
              ? isFocused
                ? ''
                : placeholder || label
              : placeholder
          }
          placeholderTextColor={placeholderTextColor || colors.lightGray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          style={[styles.textInputStyles, textStyle]}
          autoCapitalize={autoCapitalize}
          onFocus={e => {
            if (onFocus) {
              onFocus(e);
            } else {
              if (floatingLabel) {
                onFocusInput();
              }
            }
          }}
          textContentType={textContentType}
          autoCorrect={autoCorrect}
          onPressIn={onPressIn}
          {...rest}
        />
        {type === 'password' ? (
          <Pressable
            style={[styles.rightIcon, rightIconStyle]}
            onPress={handlePasswordIcon}>
            {!secureTextEntry ? (
              <SvgIcon.eyeOffIcon fill={colors.gray} />
            ) : (
              <SvgIcon.eyeIcon fill={colors.gray} />
            )}
          </Pressable>
        ) : null}
        {icon && type !== 'password' ? (
          <Pressable
            style={[styles.rightIcon, rightIconStyle]}
            onPress={onIconPress}>
            {icon}
          </Pressable>
        ) : null}
      </View>
      {error && <AppText style={styles.error}>{error}</AppText>}
    </>
  );
};

export default AppTextInput;
