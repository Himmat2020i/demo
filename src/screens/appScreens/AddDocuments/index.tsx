import React, {useCallback} from 'react';
import {View, ImageBackground, Pressable} from 'react-native';
import {useAddDocumentStyle} from './styles';
import AppButton from '../../../components/button/AppButton';
import AppTextInput from '../../../components/textInput/AppTextInput';
import {Dropdown} from 'react-native-element-dropdown';
import AppText from '../../../components/text/AppText';
import Svg from '../../../assets/svg';
import useAddDocument from './hooks/useAddDocument';
import DatePicker from 'react-native-date-picker';
import {dateFormat, getFileExtensionFromUrl} from '../../../helpers/utils';
import ModalContent from '../../../components/commonContents/ModalContent';
import useDocumentPickerComponent from '../Details/components/documentPicker/hooks/useDocumentPickerComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const AddDocuments = () => {
  const {styles, colors} = useAddDocumentStyle();
  const {onAddPress} = useDocumentPickerComponent();
  const {
    onSubmit,
    data,
    control,
    Controller,
    handleSubmit,
    datePicker,
    setDatePicker,
    setValue,
    selectDoc,
    getValues,
    openFile,
    idMonitorDocument,
  } = useAddDocument();

  const renderModalContent = useCallback(
    () => <ModalContent onDataSelected={selectDoc} />,
    [selectDoc],
  );

  const openCustomModal = () => {
    onAddPress({
      item: renderModalContent(),
    });
  };
  return (
    <ImageBackground source={{uri: 'app_background'}} style={styles.container}>
      <KeyboardAwareScrollView>
        <View style={styles.subContainer}>
          <DatePicker
            modal
            mode="date"
            open={datePicker}
            minimumDate={new Date()}
            date={new Date()}
            onConfirm={date => {
              setValue('documentExpiryDate', dateFormat(date));
              setDatePicker(false);
            }}
            onCancel={() => {
              setDatePicker(false);
            }}
          />
          <AppText style={styles.label}>
            Document Name<AppText style={styles.required}>*</AppText>
          </AppText>
          <Controller
            control={control}
            name="idMonitorDocumentType"
            render={({
              field: {onChange, value, onBlur},
              fieldState: {error},
            }) => (
              <View>
                <Dropdown
                  value={value}
                  data={data}
                  disable={!!idMonitorDocument}
                  labelField={'text'}
                  valueField={'value'}
                  onBlur={onBlur}
                  onChange={(item: any) => onChange(item?.value)}
                  placeholder="Please Select"
                  placeholderStyle={styles.placeholder}
                  selectedTextStyle={styles.selectContainer}
                  itemTextStyle={styles.itemContainer}
                  style={styles.dropdownContainer}
                />
                {error && (
                  <AppText style={styles.errorStyle}>{error?.message}</AppText>
                )}
              </View>
            )}
          />
          <AppText style={styles.label}>
            Upload New Document<AppText style={styles.required}>*</AppText>
          </AppText>
          <Controller
            control={control}
            name="document"
            render={({fieldState: {error}}) => (
              <View>
                <View style={styles.addDocumentContainer}>
                  <Pressable style={styles.addIcon} onPress={openCustomModal}>
                    <Svg.addIcon height={18} width={18} fill={colors.primary} />
                  </Pressable>
                  {getValues()?.document?.uri && (
                    <Pressable
                      style={styles.fileContainer}
                      onPress={() => openFile(getValues().document?.uri)}>
                      <Svg.fileIcon height={'100%'} width={'100%'} />
                      <AppText numberOfLines={1} style={styles.fileType}>
                        {getFileExtensionFromUrl(getValues().document?.name)}
                      </AppText>
                    </Pressable>
                  )}
                </View>
                {!getFileExtensionFromUrl(getValues().document?.name) && (
                  <AppText style={styles.errorStyle}>{error?.message}</AppText>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="documentExpiryDate"
            render={({
              field: {onChange, value, onBlur},
              fieldState: {error},
            }) => (
              <Pressable onPress={() => setDatePicker(true)}>
                <AppTextInput
                  label="New Expiry Date"
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  required
                  editable={false}
                  placeholder="DD/MM/YYYY"
                  labelStyle={styles.descriptionText}
                  textStyle={styles.inputText}
                  style={styles.description}
                  type="text"
                  icon={
                    <Svg.dateIcon fill={colors.gray} height={18} width={18} />
                  }
                  onIconPress={() => setDatePicker(true)}
                />
                {!getValues()?.documentExpiryDate && (
                  <AppText style={styles.errorStyle}>{error?.message}</AppText>
                )}
              </Pressable>
            )}
          />
          <Controller
            control={control}
            name={'description'}
            render={({field: {onChange, value, onBlur}}) => (
              <AppTextInput
                value={value}
                label={'Description'}
                textAlignVertical={'top'}
                placeholder={'Write here....'}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={3}
                autoCorrect={false}
                returnKeyType={'done'}
                textStyle={styles.inputText}
                labelStyle={styles.descriptionText}
                style={[styles.description, styles.desc]}
              />
            )}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.button}>
        <AppButton
          title={idMonitorDocument ? 'Update' : 'Submit'}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </ImageBackground>
  );
};

export default AddDocuments;
