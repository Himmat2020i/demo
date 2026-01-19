import React, { useState } from "react";
import {
  TextInput,
  View,
  Pressable,
  StyleProp,
  TextStyle,
  ViewStyle,
  TextInputProps,
} from "react-native";
import SvgIcon from "../../assets/svg";
import { useTheme } from "../../hooks";
import AppText from "../text/AppText";
import { useAppTextInputStyle } from "./AppTextInputStyle";
import CustomSelect from "../tooltip/Tooltip";

interface props extends TextInputProps {
  items?: any;
  inputRef?: any;
  setValue?: any;
  label?: string;
  prefix?: string;
  required?: boolean;
  valueType?: string;
  leftIcon?: JSX.Element;
  floatingLabel?: boolean;
  error?: string | undefined;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onIconPress?: () => void | undefined;
  leftIconStyle?: StyleProp<ViewStyle>;
  rightIconStyle?: StyleProp<ViewStyle>;
  floatingLabelStyle?: StyleProp<TextStyle>;
  // eslint-disable-next-line prettier/prettier
  icon?: keyof typeof SvgIcon | React.JSX.Element;
  autoCapitalize?: 'characters' | 'words' | 'sentences' | 'none';
  type?: 'password' | 'number' | 'email' | 'phone' | 'text' | 'percentage' | 'address';
  preFixCode?: string;
  popover?: React.JSX.Element;
}

const ICON_SIZE = 22;

const AuthTextInput = ({
  icon,
  type,
  error,
  style,
  label,
  value,
  prefix,
  onBlur,
  onFocus,
  popover,
  inputRef,
  required,
  leftIcon,
  onPressIn,
  textStyle,
  autoCorrect,
  onIconPress,
  placeholder,
  onChangeText,
  floatingLabel,
  rightIconStyle,
  textContentType,
  placeholderTextColor,
  autoCapitalize = 'none',
  preFixCode,
  ...rest
}: props) => {
  const [isFocused, setIsFocused] = useState(false);
  const styles = useAppTextInputStyle({ leftIcon, editable: rest?.editable });
  const { colors } = useTheme();
  const Svg = typeof icon === "string" ? SvgIcon[icon] : null;

  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(
    type === "password"
  );

  const handleOnBlur = () => {
    setIsFocused(false);
  };
  const onFocusInput = () => {
    setIsFocused(true);
  };
  const handlePasswordIcon = () => {
    setSecureTextEntry((prev) => !prev);
  };

  const getKeyboardType = () => {
    switch (type) {
      case "email":
        return "email-address";
      case "number":
        return "numeric";
      case "phone":
        return "phone-pad";
      case "percentage":
        return "numeric";
      default:
        return "default";
    }
  };

  return (
    <>
      <View
        style={[
          styles.authTextInputContainer,
          isFocused && { borderColor: colors.primary },
          style,
          error ? styles.errorWrapper : {},
          prefix ? styles.prefixContainer : {},
        ]}
      >
        {label ? (
          <AppText style={styles.authLabel}>
            {label}
            {required ? (
              <AppText style={[styles.label, styles.required]}>*</AppText>
            ) : null}
          </AppText>
        ) : null}
        <View style={styles.inputStyle}>
          {prefix ? (
            <AppText style={[styles.prefixTextStyles, textStyle]}>
              {prefix}
            </AppText>
          ) : null}
          {preFixCode ? (
            <AppText style={[styles.prefixCodeTextStyles, textStyle]}>
              {preFixCode}
            </AppText>
          ) : null}

          <TextInput
            onBlur={(e) => {
              if (onBlur) {
                onBlur(e);
                handleOnBlur();
              } else {
                handleOnBlur();
              }
            }}
            ref={inputRef}
            keyboardType={getKeyboardType()}
            placeholder={
              floatingLabel
                ? isFocused
                  ? ""
                  : placeholder || label
                : placeholder
            }
            placeholderTextColor={placeholderTextColor || colors.lightGray}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            style={[styles.authTextInputStyles, textStyle]}
            autoCapitalize={autoCapitalize}
            onFocus={(e) => {
              if (onFocus) {
                onFocus(e);
              } else {
                onFocusInput();
              }
              setIsFocused(true);
            }}
            textContentType={textContentType}
            autoCorrect={autoCorrect}
            onPressIn={onPressIn}
            {...rest}
          />
        </View>
        {type === "password" ? (
          <Pressable
            style={[styles.rightIcon, rightIconStyle]}
            onPress={handlePasswordIcon}
          >
            {!secureTextEntry ? (
              <SvgIcon.eyeOffIcon
                fill={isFocused ? colors.primary : colors.gray}
                width={ICON_SIZE}
                height={ICON_SIZE}
              />
            ) : (
              <SvgIcon.eyeIcon
                fill={isFocused ? colors.primary : colors.gray}
                width={ICON_SIZE}
                height={ICON_SIZE}
              />
            )}
          </Pressable>
        ) : null}
        {icon && type !== "password" ? (
          <Pressable
            style={[styles.rightIcon, rightIconStyle]}
            onPress={onIconPress}
          >
            {typeof icon === "string" && Svg ? (
              popover ? (
                <CustomSelect
                  popover={popover}
                  children={
                    <Svg
                      fill={isFocused ? colors.primary : colors.gray}
                      width={ICON_SIZE}
                      height={ICON_SIZE}
                    />
                  }
                />
              ) : (
                Svg && (
                  <Svg
                    fill={isFocused ? colors.primary : colors.gray}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                  />
                )
              )
            ) : (
              icon
            )}
          </Pressable>
        ) : null}
      </View>
      {error && <AppText style={styles.error}>{error}</AppText>}
    </>
  );
};

export default AuthTextInput;
