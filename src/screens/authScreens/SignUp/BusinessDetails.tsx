import {View, SafeAreaView, ImageBackground} from 'react-native';
import React, {useState} from 'react';
import {useSignUpStyle} from './styles';
import useSignUp from './hooks/useSignUp';
import ListItem from '../../../components/listItems/ListItem';
import {businessDetailsSchema} from '../../../helpers/yupHelper';
import AuthDropDown from '../../../components/textInput/AuthDropDown';
import WelcomeLabel from '../../../components/welcomLabel/WelComelabel';
import AuthTextInput from '../../../components/textInput/AuthTextInput';
import FooterButton from '../../../components/footerButton/FooterButton';
import {
  BUSINESS_INFO,
  BUTTONS,
  COMPANY_INFORMATION,
  PLACEHOLDER,
} from '../../../constants/stringConstant';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppText from '../../../components/text/AppText';
const BusinessDetails = () => {
  const {styles, colors} = useSignUpStyle();
  const [inputHeight, setInputHeight] = useState(0);
  const lineHeight = 20;
  const minLines = 3;
  const maxLines = 10;
  const minHeight = lineHeight * minLines;
  const maxHeight = lineHeight * maxLines;
  const {
    trade,
    control,
    subTrade,
    onSubmit,
    getValues,
    termsList,
    Controller,
    onBackPress,
    onTermsPress,
    handleSubmit,
    onTradeSubmit,
    isTradeSelected,
  } = useSignUp({schema: businessDetailsSchema});

  const renderItems = (item: any, index: number) => {
    return (
      <Controller
        key={index}
        control={control}
        name={item?.value}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <View>
            <ListItem
              size={18}
              item={item}
              type={'check'}
              nameKey={'title'}
              isSelected={value}
              style={styles.listStyle}
              otherText={error && '*'}
              isRequired
              checkColor={colors.primary}
              checkStyle={styles.checkStyle}
              itemTextStyle={styles.listTextStyle}
              onTextPress={() => onTermsPress(item)}
              setSelectedId={() => onChange(!getValues()?.[item?.value])}
            />
          </View>
        )}
      />
    );
  };
  const sortArr = subTrade
    ?.slice()
    .sort((a, b) => a.subTradeName.localeCompare(b.subTradeName));
  return (
    <ImageBackground style={styles.container} source={{uri: 'auth_background'}}>
      <SafeAreaView style={styles.mainContainer}>
        <WelcomeLabel
          label={BUSINESS_INFO.label}
          message={BUSINESS_INFO.message}
        />
        <KeyboardAwareScrollView
          enableAutomaticScroll
          extraScrollHeight={200}
          contentContainerStyle={styles.scrollContainer}
          style={styles.subContainer}>
          <Controller
            control={control}
            name="idTrade"
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <AuthDropDown
                item={trade}
                value={value}
                label={'Trade'}
                type={'radio'}
                onChange={onChange}
                icon={'dropdownIcon'}
                error={error?.message}
                labelField={'tradeName'}
                placeholder={PLACEHOLDER.trade}
                onSubmitPress={onTradeSubmit}
                titleStyle={styles.titleStyle}
                required
              />
            )}
          />

          {!!isTradeSelected && (
            <Controller
              control={control}
              name="subTradeIds"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <AuthDropDown
                  value={value}
                  type={'check'}
                  item={sortArr}
                  label="Sub Trade(s)"
                  onChange={onChange}
                  icon={'dropdownIcon'}
                  error={error?.message}
                  labelField={'subTradeName'}
                  placeholder={PLACEHOLDER.subTrade}
                  titleStyle={styles.titleStyle}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="generalDescription"
            render={({
              field: {onChange, value, onBlur},
              fieldState: {error},
            }) => (
              <AuthTextInput
                multiline
                value={value}
                onBlur={onBlur}
                onContentSizeChange={event => {
                  const newHeight = event.nativeEvent.contentSize.height;
                  setInputHeight(Math.min(newHeight, maxHeight));
                }}
                icon={'infoIcon'}
                numberOfLines={3}
                autoCorrect={false}
                style={[
                  styles.input,
                  styles.comInfoStyle,
                  {
                    minHeight,
                    height: Math.max(minHeight, inputHeight) + 30,
                    maxHeight: maxHeight + 30,
                  },
                ]}
                error={error?.message}
                textAlignVertical={'top'}
                onChangeText={onChange}
                label={'Company Information'}
                maxLength={150}
                required
                popover={
                  <AppText style={styles.infoText}>
                    {COMPANY_INFORMATION}
                  </AppText>
                }
                textStyle={[
                  styles.inputText,
                  {
                    height: Math.max(
                      minHeight,
                      Math.min(maxHeight, inputHeight),
                    ),
                  },
                ]}
                placeholder={PLACEHOLDER.companyInfo}
              />
            )}
          />
          {termsList && termsList?.map(renderItems)}
        </KeyboardAwareScrollView>
        <FooterButton
          labelStyles={styles.nextStyle}
          confirmLabel={BUTTONS.next}
          cancelLabel={BUTTONS.previous}
          cancelStyle={styles.button}
          onPressCancel={onBackPress}
          confrimStyle={styles.button}
          containerStyle={styles.buttonContainer}
          onPressConfirm={handleSubmit(() => onSubmit())}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};
export default BusinessDetails;
