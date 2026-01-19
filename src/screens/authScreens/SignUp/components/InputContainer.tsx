import React from "react";
import Svg from "../../../../assets/svg";
import useSignUp from "../hooks/useSignUp";
import { useSignUpStyle } from "../styles";
import AuthTextInput from "../../../../components/textInput/AuthTextInput";
import { KeyboardTypeOptions, TextStyle } from "react-native";

interface Props {
  type?: any;
  control?: any;
  label?: string;
  placeHolder?: string;
  controllerName?: any;
  // eslint-disable-next-line prettier/prettier
  icon?: keyof typeof Svg | React.JSX.Element;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
  onPress?: () => void;
  onSubmitEditing?: () => void;
  onChange?: (text: string) => void;
  textStyle?: TextStyle;
  autoCapitalize?: "none" | "characters" | "words" | "sentences";
  emailErrorMessage?: string;
  preFixCode?: string;
  maxLength?: number;
  required?: boolean;
}

const RenderInput = React.memo(
  ({
    type,
    icon,
    label,
    onPress,
    control,
    placeHolder,
    keyboardType,
    controllerName,
    editable = true,
    textStyle,
    autoCapitalize,
    onSubmitEditing,
    onChange,
    emailErrorMessage,
    preFixCode,
    maxLength,
    required,
  }: Props) => {
    const { styles } = useSignUpStyle();
    const { Controller } = useSignUp({});

    return (
      <Controller
        control={control}
        name={controllerName}
        render={({
          fieldState: { error },
          field: { onChange: onFieldChange, value, onBlur },
        }) => (
          <AuthTextInput
            type={type}
            icon={icon}
            value={value}
            label={label}
            onBlur={onBlur}
            editable={editable}
            onPressIn={onPress}
            autoCorrect={false}
            style={styles.input}
            error={emailErrorMessage ? emailErrorMessage : error?.message}
            onSubmitEditing={onSubmitEditing}
            onChangeText={(text) => {
              onFieldChange(text); // Update field value
              onChange && onChange(text); // Call parent onChange
            }}
            placeholder={placeHolder}
            keyboardType={keyboardType}
            textStyle={[styles.inputText, textStyle]}
            autoCapitalize={autoCapitalize}
            returnKeyType={"done"}
            preFixCode={preFixCode}
            maxLength={maxLength}
            required={required}
          />
        )}
      />
    );
  }
);

export default RenderInput;
