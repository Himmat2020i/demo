import React from 'react';
import {
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useChangePasswordStyle} from './styles';
import AppText from '../../../components/text/AppText';
import AppButton from '../../../components/button/AppButton';
import AppTextInput from '../../../components/textInput/AppTextInput';
import useChangePassword from './hooks/useChangePassword';
import {
  CHANGE_PASSWORD,
  COMMON_STRING,
  PLACEHOLDER,
} from '../../../constants/stringConstant';

const ChangePassword = () => {
  const {styles} = useChangePasswordStyle();
  const {Controller, control, onPress, handleSubmit} = useChangePassword();

  return (
    <ImageBackground source={{uri: 'app_background'}} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.subContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <AppText fontFamily={'bold'} style={styles.label}>
          {CHANGE_PASSWORD.label}
        </AppText>
        <AppText style={styles.subLabel}>{CHANGE_PASSWORD.message}</AppText>
        <Controller
          control={control}
          name="oldPassword"
          render={({field: {onChange, value, onBlur}, fieldState: {error}}) => (
            <AppTextInput
              placeholder={PLACEHOLDER.password}
              label={COMMON_STRING.currentPass}
              required
              type="password"
              error={error?.message}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              textStyle={styles.textInput}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({field: {onChange, value, onBlur}, fieldState: {error}}) => (
            <AppTextInput
              placeholder={PLACEHOLDER.password}
              label="Password"
              required
              type="password"
              error={error?.message}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              textStyle={styles.textInput}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({field: {onChange, value, onBlur}, fieldState: {error}}) => (
            <AppTextInput
              placeholder={PLACEHOLDER.confirm}
              label={COMMON_STRING.conrimPass}
              type="password"
              error={error?.message}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              required
              style={styles.input}
              textStyle={styles.textInput}
            />
          )}
        />
      </KeyboardAvoidingView>
      <View style={styles.button}>
        <AppButton title="Update Password" onPress={handleSubmit(onPress)} />
      </View>
    </ImageBackground>
  );
};

export default ChangePassword;
