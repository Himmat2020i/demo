import React from 'react';
import useProfile from './hooks/useProfile';
import {ImageBackground, View} from 'react-native';
import AppText from '../../../components/text/AppText';
import {Dropdown} from 'react-native-element-dropdown';
import AppButton from '../../../components/button/AppButton';
import {PLACEHOLDER} from '../../../constants/stringConstant';
import {HONORIFIC} from '../../../constants/profileConstants';
import {HonorificType} from '../../../interfaces/profileData';
import AppTextInput from '../../../components/textInput/AppTextInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Profile = () => {
  const {
    Controller,
    control,
    onPress,
    styles,
    colors,
    handleSubmit,
    getValues,
  } = useProfile();

  return (
    <ImageBackground source={{uri: 'app_background'}} style={styles.container}>
      <KeyboardAwareScrollView style={styles.subContainer}>
        <View>
          <AppText style={styles.firstName}>
            First Name
            <AppText style={styles.required}>*</AppText>
          </AppText>
          <View style={styles.firstNameContainer}>
            <Controller
              control={control}
              name="title"
              render={({
                field: {onChange, value, onBlur},
                fieldState: {error},
              }) => {
                return (
                  <View style={styles.dropdwon}>
                    <Dropdown
                      value={value}
                      data={HONORIFIC}
                      labelField={'name'}
                      valueField={'name'}
                      onBlur={onBlur}
                      onChange={(item: HonorificType) => {
                        onChange?.(item?.name);
                      }}
                      placeholder="Mr."
                      placeholderStyle={styles.placeholder}
                      activeColor={colors.gray85}
                      selectedTextStyle={styles.selectTextStyle}
                      itemTextStyle={styles.itemTextStyle}
                      style={styles.dropdownContainer}
                    />
                    {!getValues()?.title && (
                      <AppText style={styles.errorStyle}>
                        {error?.message}
                      </AppText>
                    )}
                  </View>
                );
              }}
            />
            <View style={styles.firstContainer}>
              <Controller
                control={control}
                name="firstName"
                render={({
                  field: {onChange, value, onBlur},
                  fieldState: {error},
                }) => (
                  <AppTextInput
                    value={value}
                    onBlur={onBlur}
                    error={error?.message}
                    onChangeText={onChange}
                    textContentType={'name'}
                    autoCapitalize={'sentences'}
                    textStyle={styles.textInput}
                    style={styles.firstNameInput}
                    maxLength={30}
                    placeholder={PLACEHOLDER.firstName}
                  />
                )}
              />
            </View>
          </View>
        </View>
        <Controller
          control={control}
          name="lastName"
          render={({field: {onChange, value, onBlur}, fieldState: {error}}) => (
            <AppTextInput
              required
              value={value}
              onBlur={onBlur}
              label={'Last Name'}
              maxLength={30}
              style={styles.input}
              error={error?.message}
              onChangeText={onChange}
              autoCapitalize={'sentences'}
              textStyle={styles.textInput}
              placeholder={PLACEHOLDER.lastName}
            />
          )}
        />
        <Controller
          control={control}
          name="emailAddress"
          render={({field: {value}}) => (
            <AppTextInput
              value={value}
              editable={false}
              style={styles.input}
              label={'Email Address'}
              textStyle={styles.textInput}
            />
          )}
        />
        <Controller
          control={control}
          name="telephone"
          render={({field: {onChange, value, onBlur}, fieldState: {error}}) => (
            <AppTextInput
              required
              value={value}
              onBlur={onBlur}
              label={'Telephone'}
              style={styles.input}
              error={error?.message}
              onChangeText={onChange}
              keyboardType={'number-pad'}
              maxLength={11}
              textStyle={styles.textInput}
              placeholder={PLACEHOLDER.telephone}
            />
          )}
        />
      </KeyboardAwareScrollView>
      <View style={styles.button}>
        <AppButton title="Save" onPress={handleSubmit(onPress)} />
      </View>
    </ImageBackground>
  );
};

export default Profile;
